import { Request, Response } from "express"
import { BadRequestException, HttpException, NotFoundException } from "@yukikaze/lib/exception"
import { AuthValidators } from "@yukikaze/validator"

export class UserService {
    public async getUsers(request: Request, response: Response) {
        try {
            // const { } = request.query
            return response.json({ message: 'User details fetched successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            // if (!data) throw new NotFoundException('User not found')
            return response.json({ message: 'User details fetched successfully'})
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
            return response.json({ message: 'User details fetched successfully'})
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateUser(request: Request<{ id: string }, {}, AuthValidators.UpdateUserInput>, response: Response) {
        try {
            const { id } = request.params
            const { fullname, password } = request.body
            return response.json({ message: 'User updated successfully', data: { id, fullname, password } })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async verifyEmail(request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) {
        try {
            const { id } = request.params
            const { token } = request.query
            // if (!user) throw new NotFoundException('User not found')
            // if (user.isVerified) return response.json({ message: 'Email is already verified' })
            // if (user.verifyToken && user.verifyToken !== token) throw new BadRequestException('Invalid verification token')
            // if (user.verifyTokenExpires && user.verifyTokenExpires < new Date()) throw new BadRequestException('Verification token has expired')
            return response.json({ message: 'Email verified successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}