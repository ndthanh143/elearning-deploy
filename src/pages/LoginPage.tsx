import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, OutlinedInput, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import GoogleLogin from 'react-google-login'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { configs } from '../configs'
import { gapi } from 'gapi-script'
import { useMutation } from '@tanstack/react-query'
import authService from '../services/auth/auth.service'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks'
import { useNavigate } from 'react-router-dom'

const schema = object({
  username: string().required('Please fill in your username'),
  password: string().required('Please fill in your password'),
})

const clientId = configs.GOOGLE_CLIENT_ID
export const LoginPage = () => {
  const navigate = useNavigate()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) })

  const { profile, loginGoogle } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const onSubmitHandler = () => {}

  const responseGoogle = ({ accessToken }) => loginGoogle(accessToken)

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId,
        scope: '',
      })
    }

    gapi.load('client:auth2', start)
  }, [])

  useEffect(() => {
    if (profile) {
      navigate('/')
    }
  }, [profile])

  return (
    <Box
      height='100vh'
      width='100vw'
      overflow='hidden'
      position='relative'
      sx={{
        backgroundImage:
          'url(https://nienlich.vn/Userfiles/Upload/images/309029473_819241772825135_7321420649589543852_n.jpg), linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
      }}
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmitHandler)}
        position='absolute'
        bgcolor='#fff'
        boxShadow={20}
        zIndex={10}
        display='flex'
        flexDirection='column'
        gap={3}
        p={4}
        minWidth={{
          xs: 300,
          md: 500,
        }}
        borderRadius={4}
      >
        <Typography textAlign='center' variant='h5' fontWeight={700}>
          Sign in
        </Typography>
        <Box>
          <Typography variant='caption' color='text.secondary' marginBottom={4}>
            Email
          </Typography>
          <TextField placeholder='example@gmail.com' fullWidth size='small' {...register('username')} />
          {errors.username && (
            <Typography variant='caption' color='error.main'>
              {errors.username.message}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant='caption' color='text.secondary'>
            Password
          </Typography>
          <OutlinedInput
            placeholder='********'
            fullWidth
            size='small'
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
        </Box>
        <Typography variant='body2' color='primary'>
          Forgot password?
        </Typography>

        <Button variant='contained' fullWidth type='submit'>
          Sign in
        </Button>

        <Divider>Or</Divider>
        <GoogleLogin
          clientId={clientId}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy='single_host_origin'
          isSignedIn={true}
        />
      </Box>
    </Box>
  )
}
