import express, { Request, Response } from "express"
import userController from "./user.controller"
import multer from "multer"
import { fileMimeAndSizeOptions, JWTMiddleware, multerOptions, Options, validateRequest } from "@yukikaze/middleware"
import { AuthValidators } from "@yukikaze/validator"

const userRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["avatar"],
    allowed: {
        avatar: { mimes: ["image/jpeg", "image/png", "image/webp"], exts: ["jpg", "jpeg", "png", "webp"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

userRouter.get("/", (request: Request, response: Response) => userController.getUsers(request, response))

// user public profile, anyone can see (cannot see private playlists/songs & followed artists)
userRouter.get("/:id", (request: Request<{ id: string }>, response: Response) => userController.findUser(request, response))

// user private profile, only accessible when login
userRouter.get("/me/profile",
    JWTMiddleware,
    (request: Request, response: Response) => userController.myProfile(request, response)
)

// update user profile
userRouter.put("/:id",
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    fileValidator,
    validateRequest(AuthValidators.updateUserInput),
    (request: Request<{ id: string }, {}, AuthValidators.UpdateUserInput>, response: Response) => userController.updateUser(request, response)
)

userRouter.put("/verify-email/:id",
    (request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) => userController.verifyEmail(request, response)
)

export { userRouter }