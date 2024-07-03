import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Container, IconButton, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { SignUpPayload } from '@/services/auth/auth.dto'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authService from '@/services/auth/auth.service'
import { userKeys } from '@/services/user/user.query'
import { useAlert, useAuth } from '@/hooks'

const schema = object({
  email: string().required('Please fill in your email'),
  password: string().required('Please fill in your password'),
  fullName: string().required('Please fill in your full name'),
  avatarPath: string(),
})

export function SignUpForm({ type, defaultValues }: { type: 'student' | 'teacher'; defaultValues: SignUpPayload }) {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)

  const { setAuthenticated } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultValues,
    },
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const { mutate: mutateSignUp } = useMutation({
    mutationFn: authService.signUp,
    onSuccess: () => {
      setAuthenticated()
      queryClient.invalidateQueries({ queryKey: userKeys.profiles() })
      triggerAlert('Sign up successfully!')
    },
  })

  const onSubmitHandler = (payload: SignUpPayload) => {
    mutateSignUp({ type, payload })
  }

  return (
    <Container maxWidth='xs'>
      <Box width='100%' component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={3}>
          <TextField fullWidth {...register('fullName')} disabled />
          <TextField placeholder='Email' fullWidth {...register('email')} disabled />
          <Stack width='100%'>
            <OutlinedInput
              placeholder='Password'
              fullWidth
              sx={{ borderRadius: 2 }}
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              endAdornment={
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
            {errors.password && (
              <Typography variant='caption' color='error.main'>
                {errors.password.message}
              </Typography>
            )}
          </Stack>

          <Button fullWidth type='submit' variant='contained' sx={{ mt: 4, py: 1 }} disabled={!isValid}>
            Sign up
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}
