import { useFormContext, Controller } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@yukikaze/ui/field'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@yukikaze/ui/input-otp'

type RHFTextFieldProps = {
    name: string
    fieldLabel: string
}

export const RHFInputOTP = ({
    name,
    fieldLabel,
    // ...other
}: RHFTextFieldProps) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
                <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
                    <InputOTP
                        maxLength={6}
                        {...field}
                        containerClassName='justify-center sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    {invalid && <FieldError errors={[error]} />}
                </Field>
            )}
        />
    )
}