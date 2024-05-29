import { useAlert } from '@/hooks'
import { SignUpPayload } from '@/services/auth/auth.dto'
import authService from '@/services/auth/auth.service'
import { regexPattern } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Box, Button, Stack, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

type FormData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

const schema = object({
  email: string()
    .matches(regexPattern.emailValidation, 'Please fill in your correct email')
    .required('Please fill in your email'),
  password: string()
    .matches(
      regexPattern.passwordValidation,
      'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number',
    )
    .required('Please fill in your password'),
  firstName: string().required('Please fill in your first name'),
  lastName: string().required('Please fill in your last name'),
})

export function SignUpForm({ type }: { type: 'teacher' | 'student' }) {
  const { triggerAlert } = useAlert()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const { mutate: mutateSignUp, isError } = useMutation({
    mutationFn: authService.signUp,
    onSuccess: (payload) => {
      console.log('payload', payload)
      triggerAlert('Sign up successfully!')
    },
  })

  const onSubmitHandler = (data: FormData) => {
    const payload: SignUpPayload = {
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    }
    mutateSignUp({ type, payload })
  }

  return (
    <>
      {isError && (
        <Alert severity='error' sx={{ mb: 4, borderRadius: 3 }}>
          This account already exists! Please try again.
        </Alert>
      )}
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={2}>
          <TextField
            label='First Name'
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label='Last Name'
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
          <TextField label='Email' {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField
            label='Password'
            {...register('password')}
            type='password'
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Stack>
        <Button type='submit' variant='contained' fullWidth sx={{ py: 1, mt: 2 }}>
          Create new account
        </Button>
      </Box>
    </>
  )
}
