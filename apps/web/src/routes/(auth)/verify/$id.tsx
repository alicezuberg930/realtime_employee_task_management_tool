import { Verify } from '@/features/auth/verify'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const verifySearchSchema = z.object({
  token: z.string(),
})

export const Route = createFileRoute('/(auth)/verify/$id')({
  component: Verify,
  validateSearch: (search) => verifySearchSchema.parse(search),
})