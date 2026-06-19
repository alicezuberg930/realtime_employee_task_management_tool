import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@yukikaze/ui'
import { AuthProvider } from '@/lib/auth/AuthProvider'

export type RootRouteContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => {
    return (
      <AuthProvider>
        {/* <AuthGuard> */}
        <Outlet />
        <Toaster duration={5000} />
        {import.meta.env.MODE === 'development' && (
          <>
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
        {/* </AuthGuard> */}
      </AuthProvider>
    )
  },
})
