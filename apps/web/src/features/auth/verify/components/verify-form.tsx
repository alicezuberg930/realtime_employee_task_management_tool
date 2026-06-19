import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from '@yukikaze/ui'
import { cn } from '@yukikaze/ui'
import { verifyUserInput, type VerifyUserInput } from '@yukikaze/validator'
import { Button } from '@yukikaze/ui/button'
import { Field, FieldGroup } from '@yukikaze/ui/field'
import {
  FormProvider,
  RHFPasswordField,
  RHFTextField,
} from '@/components/hook-form'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { userQueries } from '@/lib/queries/user'
import { authQueries } from '@/lib/queries/auth'
import { paths } from '@/lib/route/paths'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function VerifyForm({
  className,
  ...props
}: UserAuthFormProps) {
  const { id } = useParams({ from: '/(auth)/verify/$id' })
  const { token } = useSearch({ from: '/(auth)/verify/$id' })
  const { mutateAsync } = useMutation(authQueries().verify.mutationOptions())
  const navigate = useNavigate()

  const form = useForm<VerifyUserInput>({
    resolver: zodResolver(verifyUserInput),
    defaultValues: {
      verifyToken: token,
      username: '',
      confirmPassword: '',
      password: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (values: VerifyUserInput) => {
    await mutateAsync({ userId: id, input: values }, {
      onSuccess() {
        navigate({ to: paths.SIGNIN, replace: true })
      }
    })
  }

  return (
    <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('grid gap-3', className)} {...props}>
        <FieldGroup>
          <RHFTextField
            name='username'
            fieldLabel='Username'
            placeholder='Hatsune Miku'
          />
          <RHFPasswordField
            name='password'
            fieldLabel='Password'
            placeholder='********'
          />
          <RHFPasswordField
            name='confirmPassword'
            fieldLabel='Confirm Password'
            placeholder='********'
          />
        </FieldGroup>

        <Button disabled={isSubmitting} type='submit'>
          {isSubmitting ? <Loader2 className='animate-spin' /> : <LogIn />}
          Confirm
        </Button>
      </div>
    </FormProvider>
  )
}
