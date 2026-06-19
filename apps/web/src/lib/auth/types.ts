import type { User } from "@/@types/user"
import type { SignInInput } from "@yukikaze/validator"

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ? { type: Key } : { type: Key, payload: M[Key] }
}

export type AuthStateType = {
  isAuthenticated: boolean
  isInitialized: boolean
  user: User | null
}

export type JWTContextType = {
  isAuthenticated: boolean
  isInitialized: boolean
  user: User | null
  signIn: (data: SignInInput) => Promise<void>
  signOut: () => void
}

export type GoogleUserResponse = {
  sub: string
  email: string
  name: string
  picture: string
}

export type FacebookUserResponse = {
  id: string
  email: string
  name: string
  picture: {
    data: { url: string }
  }
}

export type OauthAccount = {
  email: string
  name: string
  avatar: string
}

export type OAuth2Token = {
  access_token: string
  token_type: string
  expires_in: number
}

export interface CookieOptions {
  domain?: string
  expires?: Date | string | number
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: 'Strict' | 'Lax' | 'None'
  secure?: boolean
  [key: string]: unknown
}