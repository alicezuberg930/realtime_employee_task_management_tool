import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn, toast } from '@yukikaze/ui'
import { Button } from '@yukikaze/ui/button'
import { FormProvider } from '@/components/hook-form'
import { useNavigate } from '@tanstack/react-router'
import { paths } from '@/lib/route/paths'
import { RHFInputOTP } from '@/components/hook-form/RHFInputOTP'
import { otpInput, type OTPInput } from '@yukikaze/validator'
import { useMutation } from '@tanstack/react-query'
import { authQueries } from '@/lib/queries/auth'
import { usePhone } from './phone-provider'

type OtpFormProps = React.HTMLAttributes<HTMLDivElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
    const navigate = useNavigate()
    const { mutateAsync } = useMutation(authQueries().validateCode.mutationOptions())
    const { phone } = usePhone()

    const form = useForm<OTPInput>({
        resolver: zodResolver(otpInput),
        defaultValues: { accessCode: '', phone },
    })

    const { handleSubmit, watch, formState: { isSubmitting } } = form

    // eslint-disable-next-line react-hooks/incompatible-library
    const otp = watch('accessCode')

    async function onSubmit(data: OTPInput) {
        console.log(data)
        await mutateAsync(data, {
            onSuccess: () => {
                toast.success('Authentication successful')
                navigate({ to: paths.EMPLOYEE, replace: true })
            },
        })
    }
    console.log(otp.length)

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
            <div className={cn('grid gap-2', className)} {...props}>
                <RHFInputOTP
                    name='accessCode'
                    fieldLabel="One-Time Password"
                />
                <Button
                    className='mt-2'
                    disabled={otp.length < 6 || isSubmitting}
                    type='submit'
                >
                    Verify
                </Button>
            </div>
        </FormProvider>
    )
}