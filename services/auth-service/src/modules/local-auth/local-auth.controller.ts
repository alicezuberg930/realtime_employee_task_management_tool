import { Request, Response } from 'express'
import { AuthService } from './local-auth.service'
import { otpInput, phoneNumberInput, signInInput, verifyUserInput } from '@yukikaze/validator'
import { BadRequestException, HttpException } from '@yukikaze/lib/exception'
import { DEFAULT_OPTIONS } from '@/lib/helpers/auth'
import { env } from '@yukikaze/lib/create-env'

class AuthController {
    private readonly authService: AuthService
    private cookieOptions = DEFAULT_OPTIONS.cookieOptions

    constructor() {
        this.authService = new AuthService()
    }

    public async signIn(request: Request, response: Response) {
        try {
            const credentials = signInInput.parse(request.body)
            const data = await this.authService.signIn(credentials)
            response.cookie('accessToken', data.accessToken, {
                ...this.cookieOptions,
                maxAge: env.ACCESS_TOKEN_EXPIRES_IN * 1000
            })
            return response.status(200).json({ data, message: 'User logged in successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async signOut(_request: Request, response: Response) {
        try {
            response.clearCookie('accessToken', this.cookieOptions)
            return response.json({ message: 'User signed out successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createNewAccessCode(request: Request, response: Response) {
        try {
            const { phone } = phoneNumberInput.parse(request.body)
            const accessCode = await this.authService.createNewAccessCode(phone)
            return response.status(200).json({ data: { accessCode } })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async validateAccessCode(request: Request, response: Response) {
        try {
            const { phone, accessCode } = otpInput.parse(request.body)
            const data = await this.authService.validateAccessCode(phone, accessCode)
            return response.status(200).json({ message: data && 'User validation successful' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async verify(request: Request<{ id: string }, {}, {}>, response: Response) {
        try {
            const { id } = request.params
            const verifyInput = verifyUserInput.parse(request.body)
            let data = await this.authService.verify(id, verifyInput)
            return response.status(200).json({ message: data && 'User validation successful' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}

export default new AuthController()