import { Employees } from '@/features/dashboard/employees'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: Employees,
})
