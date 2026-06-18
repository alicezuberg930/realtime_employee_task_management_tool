import { Request, Response } from "express"
import { UserService } from "./local-auth.service"
import { AuthValidators } from "@yukikaze/validator"
import { BadRequestException, HttpException } from "@yukikaze/lib/exception"

class UserController {
    private readonly userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    public async signUp(request: Request<{}, {}, AuthValidators.SignUpInput>, response: Response) {
        return await this.userService.signUp(request, response)
    }

    public async signIn(request: Request<{}, {}, AuthValidators.SignInInput>, response: Response) {
        return await this.userService.signIn(request, response)
    }

    public async signOut(request: Request, response: Response) {
        return await this.userService.signOut(request, response)
    }

    public async refreshToken(request: Request, response: Response) {
        return await this.userService.refreshToken(request, response)
    }

    public async createNewAccessCode(request: Request<{}, {}, AuthValidators.PhoneNumberInput>, response: Response) {
        try {
            const { phone } = request.body;
            const accessCode = await this.userService.createNewAccessCode(phone);
            return response.status(200).json({ data: { accessCode } });
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async validateAccessCode(request: Request<{}, {}, AuthValidators.OTPInput>, response: Response) {
        try {
            const { phone, accessCode } = request.body;
            const result = await this.userService.validateAccessCode(phone, accessCode)
            return response.status(200).json({ message: result && 'User validation successful' });
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}

export default new UserController()