import { useLocales } from '../locales'
import { useNavigate } from '@tanstack/react-router'
import { createContext, useEffect, useReducer, useCallback, useMemo, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDispatch } from '@/redux/store'
// types
import type { ActionMapType, AuthStateType, JWTContextType } from './types'
import type { User } from '@/@types'
// utils
import { paths } from '../route/paths'
import type { AuthValidators } from '@yukikaze/validator'
import { setLastTokenRefresh } from '@/redux/slices/app'
import { toast } from '@yukikaze/ui'
import { authQueries } from '../queries/auth'
import { jwtDecode } from './utils'

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean
    user: User | null
  }
  [Types.LOGIN]: {
    user: User
  }
  [Types.REGISTER]: {
    user: null
  }
  [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null
}

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    }
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  }
  return state
}

export const AuthContext = createContext<JWTContextType | null>(null)

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { translate } = useLocales()
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dispatchRedux = useDispatch()
  const interceptorRegisteredRef = useRef<boolean>(false)
  // tanstack query
  const { data, isError } = useQuery(authQueries().profile.queryOptions())
  const { mutateAsync: m1 } = useMutation(authQueries().refreshToken.mutationOptions())
  const { mutateAsync: m2 } = useMutation(authQueries().signIn.mutationOptions())
  const { mutateAsync: m4 } = useMutation(authQueries().signOut.mutationOptions())

  useEffect(() => {
    if (data) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: true,
          user: data
        },
      })
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
          isAuthenticated: false,
        },
      })
    }
  }, [isError])

  useEffect(() => {
    if (interceptorRegisteredRef.current) return

    // httpClient.interceptors.response.use(async (response) => {
    //   // Check for token expiration in response headers from auto-refresh
    //   const expiration = (response as ResponseWithHeaders<any>).headers?.get?.(
    //     'X-Access-Token-Expiration'
    //   )
    //   if (expiration) localStorage.setItem('accessTokenExpiration', expiration)
    //   return response
    // })

    interceptorRegisteredRef.current = true
  }, [])

  const signIn = useCallback(async (data: AuthValidators.SignInInput) => {
    await m2(data, {
      onSuccess: (res) => {
        navigate({ to: paths.EMPLOYEE, replace: true })
        toast.success(res.message)
        const { exp } = jwtDecode(res.data?.accessToken!)
        localStorage.setItem('accessTokenExpiration', exp)
        dispatch({
          type: Types.LOGIN,
          payload: {
            user: res.data!.user
          },
        })
      },
      onError: (err) => {
        toast.error(translate(err.message ?? translate('unknown_error')))
      }
    })
  }, [navigate, translate])

  const signOut = useCallback(async () => {
    await m4(undefined, {
      onSuccess: (_res) => {
        dispatch({ type: Types.LOGOUT })
        navigate({ to: paths.SIGNIN, replace: true })
        dispatchRedux(setLastTokenRefresh(null))
      },
      onError: (err) => {
        toast.error(err.message ?? translate('unknown_error'))
      }
    })
  }, [navigate, translate])

  // Schedule token refresh before expiration. Refreshes 20 seconds before the token expires
  const scheduleTokenRefresh = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)

    const expiredIn = localStorage.getItem('accessTokenExpiration')
    if (!expiredIn) return
    const expirationTime = Number(expiredIn) * 1000
    const now = Date.now()
    const timeUntilExpiration = Math.max(expirationTime - now, 0)
    const REFRESH_BUFFER = 20 * 1000

    // If token already expired or expires within buffer, refresh immediately
    if (timeUntilExpiration <= REFRESH_BUFFER) {
      await m1(undefined, {
        onError(_err) {
          dispatch({ type: Types.LOGOUT })
          navigate({ to: paths.SIGNIN, replace: true })
        },
        onSuccess(res) {
          const { exp } = jwtDecode(res.data?.accessToken!)
          localStorage.setItem(
            'accessTokenExpiration',
            exp
          )
          // After successful refresh, schedule the next one
          scheduleTokenRefresh()
        },
      })
      return
    }

    // Schedule refresh for later
    const timeUntilRefresh = timeUntilExpiration - REFRESH_BUFFER
    refreshTimerRef.current = setTimeout(() => {
      m1(undefined, {
        onError(_err) {
          // If refresh fails, log out the user
          dispatch({ type: Types.LOGOUT })
          navigate({ to: paths.SIGNIN, replace: true })
        },
        onSuccess(res) {
          const { exp } = jwtDecode(res.data?.accessToken!)
          localStorage.setItem(
            'accessTokenExpiration',
            exp
          )
          // After successful refresh, schedule the next one
          scheduleTokenRefresh()
        },
      })
    }, timeUntilRefresh)
  }, [m4, navigate])

  // Schedule token refresh when user logs in
  useEffect(() => {
    if (state.isAuthenticated) {
      scheduleTokenRefresh()
    } else {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    }
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    }
  }, [state.isAuthenticated, scheduleTokenRefresh])

  const memoizedValue = useMemo(() => ({
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signIn,
    signOut,
  }), [state, signIn, signOut])

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}