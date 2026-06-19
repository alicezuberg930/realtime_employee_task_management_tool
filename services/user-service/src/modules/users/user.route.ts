import express, { Request, Response } from "express"
import userController from "./user.controller"
import { JWTMiddleware, validateRequest } from "@yukikaze/middleware"

const userRouter = express.Router()

userRouter.post("/", (request: Request, response: Response) => userController.createEmployee(request, response))

userRouter.get("/", (request: Request, response: Response) => userController.getEmployee(request, response))

userRouter.delete("/:id", (request: Request<{ id: string }, {}>, response: Response) => userController.deleteEmployee(request, response))

// user private profile, only accessible when login
userRouter.get("/me/profile",
    JWTMiddleware,
    (request: Request, response: Response) => userController.profile(request, response)
)

// update user profile
userRouter.put("/:id",
    (request: Request<{ id: string }, {}>, response: Response) => userController.updateEmployee(request, response)
)
export { userRouter }