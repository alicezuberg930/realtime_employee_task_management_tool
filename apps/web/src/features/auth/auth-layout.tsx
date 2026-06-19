import { Logo } from '@/assets/logo'
import { Outlet } from '@tanstack/react-router'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-120 sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2' />
          <h1 className='text-xl font-medium'>Employee Management Tool</h1>
        </div>
        {children ?? <Outlet />}
      </div>
    </div>
  )
}
