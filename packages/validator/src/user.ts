import * as z from 'zod'

export const userStatusSchema = z.union([
    z.literal('active'),
    z.literal('inactive'),
    z.literal('invited'),
    z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

export const userRoleSchema = z.union([
    z.literal('employee'),
    z.literal('manager'),
])

export const userSchema = z
    .object({
        firstName: z.string().min(1, 'First Name is required.'),
        lastName: z.string().min(1, 'Last Name is required.'),
        username: z.string().min(1, 'Username is required.'),
        phoneNumber: z.string().min(1, 'Phone number is required.'),
        email: z.email({
            error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
        }),
        status: userStatusSchema,
        role: userRoleSchema,
    })
// .refine(
//     (data) => {
//         if (data.isEdit && !data.password) return true
//         return data.password.length > 0
//     },
//     {
//         message: 'Password is required.',
//         path: ['password'],
//     }
// )
// .refine(
//     ({ isEdit, password }) => {
//         if (isEdit && !password) return true
//         return password.length >= 8
//     },
//     {
//         message: 'Password must be at least 8 characters long.',
//         path: ['password'],
//     }
// )
// .refine(
//     ({ isEdit, password }) => {
//         if (isEdit && !password) return true
//         return /[a-z]/.test(password)
//     },
//     {
//         message: 'Password must contain at least one lowercase letter.',
//         path: ['password'],
//     }
// )
// .refine(
//     ({ isEdit, password }) => {
//         if (isEdit && !password) return true
//         return /\d/.test(password)
//     },
//     {
//         message: 'Password must contain at least one number.',
//         path: ['password'],
//     }
// )
// .refine(
//     ({ isEdit, password, confirmPassword }) => {
//         if (isEdit && !password) return true
//         return password === confirmPassword
//     },
//     {
//         message: "Passwords don't match.",
//         path: ['confirmPassword'],
//     }
// )

export type User = z.infer<typeof userSchema> & { id?: string }