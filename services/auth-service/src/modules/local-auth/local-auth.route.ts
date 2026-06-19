import express, { Request, Response } from 'express'
import authController from './local-auth.controller'
import { JWTMiddleware } from '@yukikaze/middleware'

const localAuthRoute = express.Router()

localAuthRoute.post('/sign-in',
    (request: Request, response: Response) => authController.signIn(request, response)
)

localAuthRoute.post('/sign-out',
    JWTMiddleware,
    (request: Request, response: Response) => authController.signOut(request, response)
)

localAuthRoute.post('/create-code',
    (request: Request, response: Response) => authController.createNewAccessCode(request, response)
)

localAuthRoute.post('/validate-code',
    (request: Request, response: Response) => authController.validateAccessCode(request, response)
)

localAuthRoute.put('/verify/:id',
    (request: Request<{ id: string }, {}, {}>, response: Response) => authController.verify(request, response)
)

export { localAuthRoute }