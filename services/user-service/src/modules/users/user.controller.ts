import { Request, Response } from 'express'
import { UserService } from './user.service'
import { userSchema } from '@yukikaze/validator'
import { BadRequestException, HttpException } from '@yukikaze/lib/exception'

class UserController {
    private readonly userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    public async getEmployee(request: Request, response: Response) {
        try {
            const data = await this.userService.getEmployee()
            return response.status(200).json({ data, message: 'Users fetched successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async deleteEmployee(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const data = await this.userService.deleteEmployee(id)
            return response.status(200).json({ message: data && 'User deleted successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async profile(request: Request, response: Response) {
        return await this.userService.myProfile(request, response)
    }

    public async createEmployee(request: Request, response: Response) {
        try {
            const user = userSchema.parse(request.body)
            const data = await this.userService.createEmployee(user)
            return response.status(200).json({ data, message: 'User created successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateEmployee(request: Request<{ id: string }, {}>, response: Response) {
        try {
            const user = userSchema.parse(request.body)
            const { id } = request.params
            const data = await this.userService.updateEmployee(id, user)
            return response.status(200).json({ data, message: 'User updated successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}

export default new UserController()