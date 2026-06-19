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
import { type User, userSchema } from '@yukikaze/validator'
import { FormProvider, RHFSelect, RHFTextField } from '@/components/hook-form'
import { NativeSelectOption } from '@yukikaze/ui/native-select'
import { userQueries } from '@/lib/queries/user'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@yukikaze/ui'

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
  const { mutateAsync: create } = useMutation(userQueries().create.mutationOptions())
  const { mutateAsync: update } = useMutation(userQueries().update.mutationOptions())

  const isEdit = !!currentRow
  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: isEdit
      ? {
        ...currentRow,
      }
      : {
        status: 'active',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: 'employee',
        phoneNumber: '',
      },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  const onSubmit = async (values: User) => {
    if (isEdit) {
      await update({ ...values, id: currentRow.id }, {
        onSuccess: (res) => {
          toast.success(res.message)
          form.reset()
          onOpenChange(false)
        }
      })
    } else {
      await create(values, {
        onSuccess: (res) => {
          toast.success(res.message)
          form.reset()
          onOpenChange(false)
        }
      })
    }
  }

  // const isPasswordTouched = !!form.formState.dirtyFields.password

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
              {/* <RHFPasswordField
                name='password'
                fieldLabel='Password'
              />
              <RHFPasswordField
                name='confirmPassword'
                fieldLabel='Confirm Password'
                disabled={!isPasswordTouched}
              /> */}
            </div>
          </FormProvider>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isSubmitting}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
