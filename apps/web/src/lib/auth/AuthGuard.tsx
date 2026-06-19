import { useState } from 'react'
import { Navigate, useLocation } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'
import { useAuthContext } from './useAuthContext'

type AuthGuardProps = {
    children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isInitialized } = useAuthContext()

    const { pathname } = useLocation()

    const [requestedLocation, setRequestedLocation] = useState<string | null>(null)

    if (!isInitialized) {
        return <>Loading</>
    }

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname)
        }
        return <SignIn />
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null)
        return <Navigate to={requestedLocation} />
    }


    return <> {children} </>
}
