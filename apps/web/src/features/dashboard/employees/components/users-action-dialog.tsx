import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@yukikaze/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@yukikaze/ui/dialog'
import { type User } from '../data/schema'
import { FormProvider, RHFPasswordField, RHFSelect, RHFTextField } from '@/components/hook-form'
import { NativeSelectOption } from '@yukikaze/ui/native-select'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Password must be at least 8 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: 'Password must contain at least one lowercase letter.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: 'Password must contain at least one number.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        ...currentRow,
        password: '',
        confirmPassword: '',
        isEdit,
      }
      : {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        isEdit,
      },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  const onSubmit = (values: UserForm) => {
    form.reset()
    onOpenChange(false)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  const roles = [
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' }
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <FormProvider
            id='user-form'
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='space-y-4 px-0.5'>
              <RHFTextField
                name='firstName'
                fieldLabel='First Name'
              />
              <RHFTextField
                name='lastName'
                fieldLabel='Last Name'
              />
              <RHFTextField
                name='username'
                fieldLabel='Username'
              />
              <RHFTextField
                name='email'
                fieldLabel='Email'
              />
              <RHFTextField
                name='phoneNumber'
                fieldLabel='Phone Number'
              />
              <RHFSelect
                name='role'
                fieldLabel='Role'
              >
                {roles.map(role => (
                  <NativeSelectOption value={role.value}>
                    {role.label}
                  </NativeSelectOption>
                ))}
              </RHFSelect>
              <RHFPasswordField
                name='password'
                fieldLabel='Password'
              />
              <RHFPasswordField
                name='confirmPassword'
                fieldLabel='Confirm Password'
                disabled={!isPasswordTouched}
              />
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
