import { Request, Response } from "express"
import { UserService } from "./user.service"
import { AuthValidators } from "@yukikaze/validator"

class UserController {
    private readonly userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    public async getUsers(request: Request, response: Response) {
        return await this.userService.getUsers(request, response)
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        return await this.userService.findUser(request, response)
    }

    public async myProfile(request: Request, response: Response) {
        return await this.userService.myProfile(request, response)
    }

    public async updateUser(request: Request<{ id: string }, {}, AuthValidators.UpdateUserInput>, response: Response) {
        return await this.userService.updateUser(request, response)
    }

    public async verifyEmail(request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) {
        return await this.userService.verifyEmail(request, response)
    }
}

export default new UserController()