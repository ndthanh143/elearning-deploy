import { Box, Button, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import authService from '@/services/auth/auth.service'
import { useNavigate } from 'react-router-dom'
import { LoginAdminPayload } from '@/services/auth/auth.dto'
import { useAlert } from '@/hooks'
import { useAuthAdmin } from '@/hooks/useAuthAdmin'
import { useEffect } from 'react'

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})

export function AdminLoginManagement() {
  const { profile, login } = useAuthAdmin()
  const { triggerAlert } = useAlert()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { mutate } = useMutation({
    mutationFn: authService.loginAdmin,
    onSuccess: () => {
      login()
    },
    onError: () => {
      triggerAlert('Username or password not match', 'error')
    },
  })

  const onSubmit = (data: LoginAdminPayload) => {
    mutate(data)
  }

  useEffect(() => {
    if (profile) {
      navigate('/admin')
    }
  }, [profile])

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='100vh'
      bgcolor='#f5f5f5'
      p={3}
    >
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        display='flex'
        flexDirection='column'
        gap={2}
        width='100%'
        maxWidth='400px'
        bgcolor='white'
        p={4}
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant='h4' align='center'>
          Admin Login
        </Typography>
        <TextField
          label='Username'
          variant='outlined'
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label='Password'
          type='password'
          variant='outlined'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type='submit' variant='contained' color='primary'>
          Login
        </Button>
      </Box>
    </Box>
  )
}
