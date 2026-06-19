import * as z from 'zod'

const passwordRegex = z
    .string()
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    )

export const signInInput = z.object({
    email: z.email('Invalid email address'),
    password: passwordRegex,
})
export type SignInInput = z.infer<typeof signInInput>
export const signInOutput = z.object({ token: z.string() })
export type SignInOutput = z.infer<typeof signInOutput>

export const allSessionsInput = z.object({
    userId: z.cuid(),
})
export type AllSessionsInput = z.infer<typeof allSessionsInput>
export const allSessionsOutput = z.array(
    z.object({
        id: z.string(),
        userAgent: z.string().nullable(),
        ipAddress: z.string().nullable(),
        createdAt: z.date(),
    }),
)
export type AllSessionsOutput = z.infer<typeof allSessionsOutput>

export const deleteSessionInput = z.object({
    sessionId: z.string(),
    userId: z.cuid(),
})
export type DeleteSessionInput = z.infer<typeof deleteSessionInput>
export const deleteSessionOutput = z.void()
export type DeleteSessionOutput = z.infer<typeof deleteSessionOutput>

export const updateUserInput = z.object({
    fullname: z
        .string()
        .min(4, 'Username must be at least 4 characters long')
        .max(20, 'Username must be at most 20 characters long')
        .regex(
            /^(?!\.)(?!.*\.$)[a-zA-Z0-9.]+$/,
            'Username can only contain letters, numbers and periods',
        ),
    birthday: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    password: passwordRegex
})
export type UpdateUserInput = z.infer<typeof updateUserInput>
export const updateUserOutput = z.void()
export type UpdateUserOutput = z.infer<typeof updateUserOutput>

export const changeUsernameInput = z.object({
    userId: z.cuid(),
    username: z
        .string()
        .min(4, 'Username must be at least 4 characters long')
        .max(20, 'Username must be at most 20 characters long')
        .regex(
            /^(?!\.)(?!.*\.$)[a-zA-Z0-9.]+$/,
            'Username can only contain letters, numbers and periods',
        ),
    password: passwordRegex,
})
export type ChangeUsernameInput = z.infer<typeof changeUsernameInput>
export const changeUsernameOutput = z.void()
export type ChangeUsernameOutput = z.infer<typeof changeUsernameOutput>

export const deleteAccountInput = z.object({
    userId: z.cuid(),
    password: passwordRegex,
})
export type DeleteAccountInput = z.infer<typeof deleteAccountInput>
export const deleteAccountOutput = z.void()
export type DeleteAccountOutput = z.infer<typeof deleteAccountOutput>

export const changePasswordInput = z
    .object({
        userId: z.cuid(),
        currentPassword: z.string().optional(),
        newPassword: passwordRegex,
        confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
        isLogOut: z.boolean().default(true),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'New passwords do not match',
        path: ['confirmNewPassword'],
    })
export type ChangePasswordInput = z.infer<typeof changePasswordInput>
export const changePasswordOutput = z.void()
export type ChangePasswordOutput = z.infer<typeof changePasswordOutput>

export const forgotPasswordInput = z.object({
    email: z.email('Invalid email address'),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInput>
export const forgotPasswordOutput = z.void()
export type ForgotPasswordOutput = z.infer<typeof forgotPasswordOutput>

export const resetPasswordInput = z
    .object({
        token: z.string().min(1, 'Token is required'),
        newPassword: passwordRegex,
        confirmNewPassword: z.string('Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'New passwords do not match',
        path: ['confirmNewPassword'],
    })
export type ResetPasswordInput = z.infer<typeof resetPasswordInput>
export const resetPasswordOutput = z.void()
export type ResetPasswordOutput = z.infer<typeof resetPasswordOutput>

export const phoneNumberInput = z.object({
    phone: z.string({ error: 'Phone number is required' })
})
export type PhoneNumberInput = z.infer<typeof phoneNumberInput>

export const otpInput = z.object({
    phone: z.string({ error: 'Phone number is required' }),
    accessCode: z.string()
        .length(6, 'Please enter the 6-digit code.')
        .regex(/^\d+$/, 'Only numbers are allowed.'),
})
export type OTPInput = z.infer<typeof otpInput>

export const verifyUserInput = z.object({
    verifyToken: z.string({ error: 'Verify token is required' }),
    username: z.string({ error: 'Username is required' }),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
})
    .refine(
        (data) => {
            if (!data.password) return true
            return data.password.length > 0
        },
        {
            message: 'Password is required.',
            path: ['password'],
        }
    )
    .refine(
        ({ password }) => {
            return password.length >= 8
        },
        {
            message: 'Password must be at least 8 characters long.',
            path: ['password'],
        }
    )
    .refine(
        ({ password }) => {
            if (!password) return true
            return /[a-z]/.test(password)
        },
        {
            message: 'Password must contain at least one lowercase letter.',
            path: ['password'],
        }
    )
    .refine(
        ({ password }) => {
            if (!password) return true
            return /\d/.test(password)
        },
        {
            message: 'Password must contain at least one number.',
            path: ['password'],
        }
    )
    .refine(
        ({ password, confirmPassword }) => {
            if (!password) return true
            return password === confirmPassword
        },
        {
            message: "Passwords don't match.",
            path: ['confirmPassword'],
        }
    )

export type VerifyUserInput = z.infer<typeof verifyUserInput>