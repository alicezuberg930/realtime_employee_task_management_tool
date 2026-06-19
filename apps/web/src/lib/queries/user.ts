import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
    Response
} from '@/@types'
import { httpClient } from '../repository/http-client'
import { getQueryClient } from '../query-client'
import type { User } from '@yukikaze/validator'

export const keys = {
    create: () => ['user', 'create'],
    update: () => ['user', 'update'],
    delete: () => ['user', 'delete'],
    getAll: () => ['user', 'get', 'all'],
} as const

export const userQueries = () => ({
    getAll: {
        queryOptions: () =>
            queryOptions({
                queryKey: keys.getAll(),
                queryFn: async () => {
                    const { data } = await httpClient.get<Response<User[]>>('/users')
                    return data
                },
            }),
    },

    create: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.create(),
                mutationFn: async (input: User) => {
                    return await httpClient.post<Response<User>>(
                        `/users`,
                        { ...input }
                    )
                },
                onSuccess() {
                    getQueryClient().invalidateQueries({ queryKey: keys.getAll() })
                },
            }),
    },

    update: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.update(),
                mutationFn: async ({ id, ...input }: User) => {
                    return await httpClient.put<Response<User>>(
                        `/users/${id}`,
                        { ...input }
                    )
                },
                onSuccess() {
                    getQueryClient().invalidateQueries({ queryKey: keys.getAll() })
                },
            }),
    },

    delete: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.delete(),
                mutationFn: async (id: string) => {
                    return await httpClient.delete<Response>(`/users/${id}`)
                },
                onSuccess() {
                    getQueryClient().invalidateQueries({ queryKey: keys.getAll() })
                },
            }),
    },
})