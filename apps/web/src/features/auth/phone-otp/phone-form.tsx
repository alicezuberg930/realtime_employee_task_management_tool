import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@yukikaze/ui'
import { Button } from '@yukikaze/ui/button'
import { FormProvider, RHFTextField } from '@/components/hook-form'
import { phoneNumberInput, type PhoneNumberInput } from '@yukikaze/validator'
import { useMutation } from '@tanstack/react-query'
import { authQueries } from '@/lib/queries/auth'
import { usePhone } from './phone-provider'

type PhoneFormProps = React.HTMLAttributes<HTMLDivElement>

export function PhoneForm({ className, ...props }: PhoneFormProps) {
    const { mutateAsync } = useMutation(authQueries().createCode.mutationOptions())
    const { setStage, setPhone } = usePhone()

    const form = useForm<PhoneNumberInput>({
        resolver: zodResolver(phoneNumberInput),
        defaultValues: { phone: '' },
    })

    const { handleSubmit, formState: { isSubmitting } } = form

    async function onSubmit(data: PhoneNumberInput) {
        setStage('verify')
        setPhone(data.phone)
        await mutateAsync(data, {
            onSuccess: () => { },
        })
    }

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
            <div className={cn('grid gap-2', className)} {...props}>
                <RHFTextField
                    name='phone'
                    fieldLabel="Phone number"
                />
                <Button
                    disabled={isSubmitting}
                    className='mt-2'
                    type='submit'
                >
                    Send OTP
                </Button>
            </div>
        </FormProvider>
    )
}

