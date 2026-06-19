import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { Link } from '@tanstack/react-router'
import { Loader2, LogIn } from '@yukikaze/ui'
import { cn } from '@yukikaze/ui'
import { signInInput, type SignInInput } from '@yukikaze/validator' 
import { Button } from '@yukikaze/ui/button'
import { Field, FieldGroup } from '@yukikaze/ui/field'
import {
  FormProvider,
  RHFPasswordField,
  RHFTextField,
} from '@/components/hook-form'
import { Link } from '@tanstack/react-router'
import { useAuthContext } from '@/lib/auth/useAuthContext'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> 

export function SignInForm({
  className,
  ...props
}: UserAuthFormProps) {
  const { signIn } = useAuthContext()

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInInput),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (values: SignInInput) => await signIn(values)

  return (
    <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('grid gap-3', className)} {...props}>
        <FieldGroup>
          <RHFTextField
            name='email'
            type='email'
            fieldLabel='Email'
            placeholder='name@example.com'
          />
          <RHFPasswordField
            name='password'
            fieldLabel='Password'
            placeholder='********'
          />
        </FieldGroup>

        <Field orientation={'horizontal'}>
          <Link
            to='/forgot-password'
            className='text-sm font-medium text-muted-foreground hover:opacity-75'
          >
            Forgot password?
          </Link>
        </Field>

        <Button disabled={isSubmitting} type='submit'>
          {isSubmitting ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

      </div>
    </FormProvider>
  )
}
