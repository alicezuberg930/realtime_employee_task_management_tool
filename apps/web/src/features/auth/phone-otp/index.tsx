import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yukikaze/ui/card'
import { OtpForm } from './otp-form'
import { Link } from '@tanstack/react-router'
import { PhoneForm } from './phone-form'
import { PhoneProvider, usePhone } from './phone-provider'
import AuthLayout from '../auth-layout'

export function PhoneOtp() {

  return (
    <PhoneProvider>
      <OtpLayout />
    </PhoneProvider>
  )
}

function OtpLayout() {
  const { stage } = usePhone()

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Phone verification
          </CardTitle>
          <CardDescription>
            {stage === 'phone' && <>Please enter your phone number so we can send an OTP access code</>}
            {stage === 'verify' && (
              <>
                Please enter the authentication code. <br /> We have sent the
                authentication code to your phone.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stage === 'phone' && <PhoneForm />}
          {stage === 'verify' && <OtpForm />}
        </CardContent>
        {stage === 'verify' && (
          <CardFooter>
            <p className='px-8 text-center text-sm text-muted-foreground'>
              Haven't received it?{' '}
              <Link
                to='/sign-in'
                className='underline underline-offset-4 hover:text-primary'
              >
                Resend a new code.
              </Link>
              .
            </p>
          </CardFooter>
        )}
      </Card>
    </AuthLayout>
  )
}
