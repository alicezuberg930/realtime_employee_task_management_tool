import { admin, db } from '@yukikaze/db'
import { BadRequestException, HttpException, NotFoundException } from '@yukikaze/lib/exception'
import { Password } from '@yukikaze/lib/password'
import { env } from '@yukikaze/lib/create-env'
import { JWT } from '@yukikaze/lib/jwt'
import { SignInInput, VerifyUserInput } from '@yukikaze/validator'
import { UserRole } from '@/lib/@types/express/roles'
import { randomInt } from 'node:crypto'

export class AuthService {

    public async signIn({ password, email }: SignInInput) {
        try {
            const snapshot = await db.collection('users').where('email', '==', email).limit(1).get()
            const user = snapshot.docs[0]?.data()
            if (!user) throw new NotFoundException('User not found')

            const isPasswordValid = await new Password().verify(user.password, password)
            if (!isPasswordValid) throw new BadRequestException('Invalid password')

            // Generate JWT access token
            const accessToken = await new JWT(env.ACCESS_TOKEN_SECRET).sign({ id: user.id }, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN })

            // Remove password from user object before returning
            const { password: _, ...userWithoutPassword } = user
            return { user: userWithoutPassword, accessToken }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
    
    public async createNewAccessCode(phone: string) {
        try {
            // generate a random 6-digit access code
            const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            let accessCode = ''
            for (let i = 0; i < 6; i++) {
                accessCode += numbers[randomInt(numbers.length)]
            }

            // in here im checking if the phone field already exists in a document then I will just override
            // the accessCode for the document that contains the phone field with the same phone number
            const phoneUserSnapshot = await db.collection('users').where('phone', '==', phone).limit(1).get()
            const phoneUserdocument = phoneUserSnapshot.docs[0]
            const userRef = phoneUserdocument?.exists ? db.collection('users').doc(phoneUserdocument.id) : db.collection('users').doc()

            await userRef.set({
                phone,
                accessCode,
                isValidated: false,
                role: UserRole.OWNER,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

            // send the access code via text message
            // await sendSmsText(phoneNumber, `Your access code is: ${accessCode}`)

            return accessCode
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async validateAccessCode(phone: string, accessCode: string) {
        try {
            const userRef = db.collection('users').doc(phone)
            const doc = await userRef.get()

            if (!doc.exists) {
                throw new NotFoundException('Phone number not found')
            }

            const userData = doc.data()

            // Validate that the access code matches and is not empty
            if (!userData || !userData.accessCode || userData.accessCode !== accessCode) {
                throw new BadRequestException('Invalid access code.')
            }

            // Set the access code to an empty string once validation is complete
            await userRef.update({ accessCode: '', isValidated: true })

            return true
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async verify(id: string, data: VerifyUserInput) {
        try {
            const userRef = db.collection('users').doc(id)
            const result = (await userRef.get()).data();
            if (!result) throw new BadRequestException('User not found')
            if (result) {
                if (result.isValidated) throw new BadRequestException('Email is already verified')
                if (data.verifyToken && result.verifyToken !== data.verifyToken) throw new BadRequestException('Invalid verification token')
                if (result.verifyTokenExpires && result.verifyTokenExpires.toDate() < new Date()) throw new BadRequestException('Verification token has expired')
                const password = await new Password().hash(data.password)
                await userRef.set({
                    password,
                    verifyToken: null,
                    username: data.username,
                    isValidated: true,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true })
                return true
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}