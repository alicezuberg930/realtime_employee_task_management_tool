import { PhoneOtp } from '@/features/auth/phone-otp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/phone-otp')({
  component: PhoneOtp,
})
