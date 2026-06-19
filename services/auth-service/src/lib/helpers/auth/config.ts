import { env } from "@yukikaze/lib/create-env"
import { AuthOptions } from "./types"

export const DEFAULT_OPTIONS = {
    cookieKeys: {
        token: 'auth.token',
        state: 'auth.state',
        code: 'auth.code',
        redirect: 'auth.redirect',
    },
    cookieOptions: {
        path: '/',
        httpOnly: true,
        secure: true, // Required for SameSite=None
        sameSite: env.NODE_ENV === 'production' ? 'lax' : 'strict', // Required for cross-domain cookies
        domain: env.NODE_ENV === 'production' ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
    },
} as const satisfies Omit<Required<AuthOptions>, 'providers'>