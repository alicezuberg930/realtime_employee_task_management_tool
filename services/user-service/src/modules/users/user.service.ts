import { Request, Response } from 'express'
import { BadRequestException, HttpException, NotFoundException } from '@yukikaze/lib/exception'
import { User } from '@yukikaze/validator'
import { admin, db } from '@yukikaze/db'
import sendEmail from "@yukikaze/email"
import { createId } from '@yukikaze/lib/create-cuid'
import { Password } from '@yukikaze/lib/password'
import { env } from '@yukikaze/lib/create-env'

export class UserService {
    public async createEmployee(user: User) {
        try {
            // check if the email already exists
            const emailSnapshot = await db.collection('users').where('email', '==', user.email).limit(1).get()
            if (!emailSnapshot.empty) throw new BadRequestException('Email already in use')

            const verifyToken = await new Password().hash(createId())
            const verifyTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now

            const userRef = db.collection('users').doc()
            await userRef.set({
                ...user,
                verifyToken,
                verifyTokenExpires,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                isValidated: false,
                isDeleted: false,
            })

            // const verifyLink = `http://localhost:5173/verify/${userRef.id}?token=${verifyToken}`

            // sendEmail({
            //     to: user.email,
            //     subject: 'Verify Your Email - Employee Management Tool',
            //     template: 'VerifyEmail',
            //     data: { username: user.username, verifyLink }
            // })
            //     .then(_ => console.log('Verification email sent successfully'))
            //     .catch(err => console.error('Failed to send verification email:', err))

            const result = (await userRef.get()).data();

            return { id: userRef.id, ...result }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async getEmployee() {
        try {
            const snapshot = await db.collection('users').where('isDeleted', '==', false).get();
            if (snapshot.empty) return []
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            return users
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async myProfile(request: Request, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException('User ID is missing in request')
            // if (!data) throw new NotFoundException('User not found')
            // Cache privately (per-user), must revalidate on each request
            response.set('Cache-Control', 'private, must-revalidate, max-age=3600')
            return response.json({ message: 'User details fetched successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async deleteEmployee(id: string) {
        try {
            const userRef = db.collection('users').doc(id)

            const snapshot = await userRef.get()
            if (!snapshot.exists) throw new BadRequestException('User not found')

            await userRef.set({
                isDeleted: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

            return true
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateEmployee(id: string, user: User) {
        try {
            const userRef = db.collection('users').doc(id)
            const result = (await userRef.get()).data();

            if (!result) throw new BadRequestException('User not found')

            await userRef.set({
                ...user,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })


            return { id: userRef.id, ...result }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}