import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackOutlined, ArrowForwardOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Container, Divider, IconButton, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { configs } from '../../configs'
import { gapi } from 'gapi-script'
import { useAlert, useAuth } from '../../hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { images } from '@/assets/images'
import { LoginAdminPayload, RoleEnum } from '@/services/auth/auth.dto'
import { useMutation } from '@tanstack/react-query'
import authService from '@/services/auth/auth.service'
import { toast } from 'react-toastify'
import { Flex, Link } from '@/components'

const schema = object({
  email: string().required('Please fill in your username'),
  password: string().required('Please fill in your password'),
})

const clientId = configs.GOOGLE_CLIENT_ID
export const LoginPage = () => {
  const { triggerAlert } = useAlert()
  const navigate = useNavigate()

  const { state } = useLocation()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) })

  const { profile, loginGoogle, refetch } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const { mutate: mutateLoginAdmin } = useMutation({
    mutationFn: authService.loginAdmin,
    onSuccess: () => {
      refetch()
      triggerAlert('Login by admin role successfully')
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

  const [mode, setMode] = useState<'teacher' | 'student' | 'default'>('default')

  const toggleMode = (role: 'teacher' | 'student' | 'default') => () => {
    setMode(role)
  }

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
    <Container sx={{ my: 4 }}>
      <Flex justifyContent='space-between'>
        <Flex gap={2}>
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
          <Link href='/' variant='body2' sx={{ textDecoration: 'none', color: 'inherit' }}>
            Back to Brainstone
          </Link>
        </Flex>
        <Flex gap={0.5}>
          <Typography variant='body2'>Don't have an account?</Typography>
          <Link href='/sign-up' variant='body2' sx={{ textDecoration: 'none' }}>
            Sign up
          </Link>
        </Flex>
      </Flex>
      <Stack width='100%' height='calc(100vh - 200px)' justifyContent='center' alignItems='center' gap={6}>
        {mode === 'default' ? (
          <>
            <Typography variant='h4'>Welcome back! Ready for class?</Typography>
            <Flex gap={2}>
              <Button
                variant='contained'
                sx={{ px: 12, py: 2, fontSize: 16 }}
                onClick={toggleMode('teacher')}
              >{`I'm a Teacher`}</Button>
              <Button
                variant='contained'
                sx={{ px: 12, py: 2, fontSize: 16 }}
                onClick={toggleMode('student')}
              >{`I'm a Student`}</Button>
            </Flex>
          </>
        ) : (
          <>
            <Flex justifyContent='space-between' width='100%' alignItems='start'>
              <IconButton onClick={toggleMode('default')}>
                <ArrowBackOutlined />
              </IconButton>
              <Typography variant='h6' maxWidth={380} textAlign='center'>
                {mode === 'teacher'
                  ? 'Welcome, teacher! Your students are waiting for some magic...'
                  : "It's Brainstone time! Class just got a lot more interesting."}
              </Typography>
              <IconButton sx={{ visibility: 'hidden' }}>
                <ArrowForwardOutlined />
              </IconButton>
            </Flex>
            <Box width='100%' component='form' onSubmit={handleSubmit(onSubmitHandler)}>
              <Container maxWidth='xs'>
                <Stack width='100%'>
                  <TextField placeholder='Email' fullWidth {...register('email')} />
                  {errors.email && (
                    <Typography variant='caption' color='error.main'>
                      {errors.email.message}
                    </Typography>
                  )}
                </Stack>

                <Stack width='100%' mt={2}>
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
                <Link
                  href='/forgot-password'
                  sx={{ textDecoration: 'none', display: 'block', textAlign: 'center', mt: 2 }}
                  variant='body2'
                >
                  Forgot your password?
                </Link>
                <Button fullWidth variant='contained' sx={{ mt: 4, py: 1 }} disabled={!isValid}>
                  Log in with Brainstone
                </Button>
                <Divider sx={{ my: 2 }}>Or</Divider>
                <Box
                  sx={{
                    width: '100%', // Ensure the Box takes full width
                    display: 'flex',
                    justifyContent: 'center',
                    boxShadow: 'none !important',
                    border: '1px solid #ccc !important',
                    borderRadius: '8px !important',
                  }}
                  component={GoogleLogin}
                  clientId={configs.GOOGLE_CLIENT_ID}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy='single_host_origin'
                  isSignedIn={false}
                />
              </Container>
            </Box>
          </>
        )}
      </Stack>
    </Container>
  )
}
