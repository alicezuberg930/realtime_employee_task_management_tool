import express, { Request, Response } from 'express'
import userController from './local-auth.controller'
import { JWTMiddleware } from '@yukikaze/middleware'
import { validateRequest } from '@yukikaze/middleware'
import { AuthValidators } from '@yukikaze/validator'

const localAuthRoute = express.Router()

// localAuthRoute.post('/sign-up',
//     validateRequest(AuthValidators.signUpInput),
//     (request: Request<{}, {}, AuthValidators.SignUpInput>, response: Response) => userController.signUp(request, response)
// )

// localAuthRoute.post('/sign-in',
//     validateRequest(AuthValidators.signInInput),
//     (request: Request<{}, {}, AuthValidators.SignInInput>, response: Response) => userController.signIn(request, response)
// )

// localAuthRoute.post('/sign-out',
//     JWTMiddleware,
//     (request: Request, response: Response) => userController.signOut(request, response)
// )

// localAuthRoute.post('/refresh',
//     (request: Request, response: Response) => userController.refreshToken(request, response)
// )

localAuthRoute.post('/create-code',
    (request: Request<{}, {}, AuthValidators.PhoneNumberInput>, response: Response) => userController.createNewAccessCode(request, response)
)

localAuthRoute.post('/validate-code',
    (request: Request<{}, {}, AuthValidators.OTPInput>, response: Response) => userController.validateAccessCode(request, response)
)

export { localAuthRoute }