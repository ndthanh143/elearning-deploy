import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, OutlinedInput, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { configs } from '../configs'
import { gapi } from 'gapi-script'
import { useAuth } from '../hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { images } from '@/assets/images'
import { LoginAdminPayload, RoleEnum } from '@/services/auth/auth.dto'
import { useMutation } from '@tanstack/react-query'
import authService from '@/services/auth/auth.service'
import { toast } from 'react-toastify'

const schema = object({
  email: string().required('Please fill in your username'),
  password: string().required('Please fill in your password'),
})

const clientId = configs.GOOGLE_CLIENT_ID
export const LoginPage = () => {
  const navigate = useNavigate()

  const { state } = useLocation()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) })

  const { profile, loginGoogle, refetch } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const { mutate: mutateLoginAdmin } = useMutation({
    mutationFn: authService.loginAdmin,
    onSuccess: () => {
      refetch()
      toast.success('Login by admin role successfully')
      navigate('/admin')
    },
  })

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const onSubmitHandler = (data: LoginAdminPayload) => {
    mutateLoginAdmin(data)
  }

  const responseGoogle = ({ accessToken }: any) => loginGoogle(accessToken)

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
      if (profile.data.roleInfo.name === RoleEnum.Admin) {
        navigate('/admin')
      } else {
        navigate(state?.form || '/')
      }
    }
  }, [profile])

  return (
    <Box
      height='100vh'
      width='100vw'
      overflow='hidden'
      position='relative'
      sx={{
        backgroundImage: 'url(background-login.jpg), linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4))',
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
        <Box
          display='flex'
          position='absolute'
          top={-60}
          right={10}
          justifyContent='center'
          width='100%'
          alignItems='center'
          gap={2}
        >
          <Box
            component='img'
            src={images.logo}
            alt='logo'
            width={40}
            height={40}
            style={{
              objectFit: 'cover',
            }}
          />
          <Typography variant='h5' fontWeight={700} color='primary.contrastText'>
            BrainStone
          </Typography>
        </Box>
        <Typography textAlign='center' variant='h5' fontWeight={700}>
          Sign in
        </Typography>
        <Box>
          <Typography variant='caption' color='text.secondary' marginBottom={4}>
            Username
          </Typography>
          <TextField placeholder='example@gmail.com' fullWidth size='small' {...register('email')} />
          {errors.email && (
            <Typography variant='caption' color='error.main'>
              {errors.email.message}
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
        {/* <Typography variant='body2' color='primary'>
          Forgot password?
        </Typography> */}

        <Button variant='contained' fullWidth type='submit'>
          Sign in
        </Button>

        <Divider>Or</Divider>
        <GoogleLogin
          clientId={configs.GOOGLE_CLIENT_ID}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy='single_host_origin'
          isSignedIn={false}
        />
      </Box>
    </Box>
  )
}
