import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
    Artist,
    HomeData,
    Playlist,
    PlaylistType,
    Response,
    Song,
    SongType,
    User
} from '@/@types'
import { httpClient } from '../repository/http-client'
import { getQueryClient } from '../queryClient'
import { keys as homeKeys } from './home'
import type { AuthValidators } from '@yukikaze/validator'

export const keys = {
    createCode: () => ['auth', 'send', 'code'],
    validateCode: () => ['auth', 'validate', 'code'],
    profile: () => ['auth', 'profile'],
    verify: () => ['auth', 'verify'],
    refreshToken: () => ['auth', 'refresh', 'token'],
    signIn: () => ['auth', 'signIn'],
    signUp: () => ['auth', 'signUp'],
    signOut: () => ['auth', 'signOut'],
} as const

export const authQueries = () => ({
    profile: {
        queryOptions: () =>
            queryOptions({
                queryKey: keys.profile(),
                queryFn: async () => {
                    const { data } = await httpClient.get<
                        Response<User>
                    >('/users/me/profile')
                    return data
                },
            }),
    },

    verify: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.verify(),
                mutationFn: async ({ userId, token }: { userId: string, token: string }) => {
                    return await httpClient.put<Response>(
                        `/users/verify-email/${userId}`,
                        { token }
                    )
                },
                onSuccess: () => {
                    getQueryClient().invalidateQueries({ queryKey: keys.profile() })
                },
            }),
    },

    refreshToken: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.refreshToken(),
                mutationFn: async () => {
                    return await httpClient.post<Response<{ accessToken: string }>>(
                        `/auth/refresh`,
                    )
                },
            }),
    },

    signIn: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.signIn(),
                mutationFn: async (input: AuthValidators.SignInInput) => {
                    return await httpClient.post<Response<{ user: User, accessToken: string }>>(`/auth/sign-in`, input)
                },
            }),
    },

    signUp: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.signUp(),
                mutationFn: async (input: AuthValidators.SignUpInput) => {
                    return await httpClient.post<Response>(`/auth/sign-up`, input)
                },
            }),
    },

    signOut: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.signOut(),
                mutationFn: async () => {
                    return await httpClient.post<Response>(`/auth/sign-out`)
                },
            }),
    },

    createCode: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.createCode(),
                mutationFn: async (input: AuthValidators.PhoneNumberInput) => {
                    return await httpClient.post<Response<{ accessCode: string }>>(
                        `/auth/create-code`,
                        { ...input }
                    )
                },
            }),
    },

    validateCode: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.validateCode(),
                mutationFn: async (input: AuthValidators.OTPInput) => {
                    return await httpClient.post<Response>(
                        `/auth/validate-code`,
                        { ...input }
                    )
                },
            }),
    },
})