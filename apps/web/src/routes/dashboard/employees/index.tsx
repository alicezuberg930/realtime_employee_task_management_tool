import { createFileRoute } from '@tanstack/react-router'
import { Employees } from '@/features/dashboard/employees'

export const Route = createFileRoute('/dashboard/employees/')({
  component: Employees,
})
