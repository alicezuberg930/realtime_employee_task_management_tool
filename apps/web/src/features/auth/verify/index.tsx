import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukikaze/ui/card'
import { VerifyForm } from './components/verify-form'
import AuthLayout from '../auth-layout'

export function Verify() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Verify account</CardTitle>
          <CardDescription>
            Enter your username and password to finish setting up your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}