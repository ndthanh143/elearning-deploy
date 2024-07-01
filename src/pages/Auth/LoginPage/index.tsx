import { gapi } from 'gapi-script'
import { object, string } from 'yup'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import GoogleLogin from 'react-google-login'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackOutlined, ArrowForwardOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { Flex, Link, Logo } from '@/components'
import authService from '@/services/auth/auth.service'
import { LoginPayload, SignUpPayload } from '@/services/auth/auth.dto'

import { configs } from '../../../configs'
import { SignUpForm } from './_components'
import { useAlert, useAuth } from '../../../hooks'
import { AxiosError } from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { icons } from '@/assets/icons'

const schema = object({
  email: string().required('Please fill in your username'),
  password: string().required('Please fill in your password'),
})

const clientId = configs.GOOGLE_CLIENT_ID
export const LoginPage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { triggerAlert } = useAlert()

  const [defaultSignUpValues, setDefaultSignUpValues] = useState<SignUpPayload>({
    email: '',
    avatarPath: '',
    fullName: '',
    password: '',
  })

  const [signUpMode, setSignUpMode] = useState<boolean>(false)

  const {
    register,
    reset: resetLoginForm,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) })

  const { refetch, setAuthenticated } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const { mutate: mutateLoginGoogle, isPending: isPendingLoginGoogle } = useMutation({
    mutationFn: authService.loginGoogle,
    onSuccess: () => {
      setAuthenticated()
      const url = state && state.from ? state.form : mode === 'teacher' ? '/courses' : '/home'

      navigate(url)
      triggerAlert('Login successfully!')
      refetch()
    },
    onError: (response: AxiosError) => {
      if (response.response?.status === 404) {
        setSignUpMode(true)
      }
    },
  })

  const {
    mutate: mutateLogin,
    isError,
    reset,
  } = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      refetch()
      triggerAlert('Login successfully!')
    },
  })

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const onSubmitHandler = (payload: LoginPayload) => {
    if (mode) {
      mutateLogin({ payload, type: mode })
    }
  }

  const responseGoogle = ({ accessToken, profileObj }: any) => {
    setDefaultSignUpValues({
      email: profileObj.email,
      avatarPath: profileObj.imageUrl,
      fullName: profileObj.name,
      password: '',
    })

    if (mode && ['teacher', 'student'].includes(mode)) {
      mutateLoginGoogle({ type: mode, accessToken })
    }
  }

  const [mode, setMode] = useState<'teacher' | 'student'>()

  const handleBack = () => {
    setMode(undefined)
    setSignUpMode(false)
  }

  const toggleMode = (role: 'teacher' | 'student') => () => {
    resetLoginForm()
    setMode(role)
    reset()
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

  return (
    <Container sx={{ my: 4 }}>
      <Flex justifyContent='space-between'>
        <Flex gap={2}>
          <Logo type='short' />
          <Link href='/' variant='body2' sx={{ textDecoration: 'none', color: 'inherit' }}>
            Back to Brainstone
          </Link>
        </Flex>
        <Flex gap={0.5}>
          <Typography variant='body2'>Don't have an account?</Typography>
          <Link href='/signup' variant='body2' sx={{ textDecoration: 'none' }}>
            Sign up
          </Link>
        </Flex>
      </Flex>
      <Stack width='100%' height='calc(100vh - 200px)' justifyContent='center' alignItems='center' gap={6}>
        {mode === undefined ? (
          <>
            <Stack alignItems='center' gap={2}>
              <Box width={100} height={100}>
                {icons['education']}
              </Box>
              <Typography variant='h4'>Welcome back! Ready for class?</Typography>
            </Stack>
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
              <IconButton onClick={handleBack}>
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
            {signUpMode ? (
              <SignUpForm type={mode} defaultValues={defaultSignUpValues} />
            ) : (
              <Box width='100%' component='form' onSubmit={handleSubmit(onSubmitHandler)}>
                <Container maxWidth='xs'>
                  {isError && (
                    <Alert severity='error' sx={{ mb: 2, borderRadius: 3 }}>
                      Incorrect email or password
                    </Alert>
                  )}
                  <Stack width='100%'>
                    <TextField placeholder='Email' fullWidth {...register('email')} disabled={isPendingLoginGoogle} />
                    {errors.email && (
                      <Typography variant='caption' color='error.main'>
                        {errors.email.message}
                      </Typography>
                    )}
                  </Stack>

                  <Stack width='100%' mt={2}>
                    <OutlinedInput
                      disabled={isPendingLoginGoogle}
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
                  <Button type='submit' fullWidth variant='contained' sx={{ mt: 4, py: 1 }} disabled={!isValid}>
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
                    disabled={isPendingLoginGoogle}
                    component={GoogleLogin}
                    clientId={configs.GOOGLE_CLIENT_ID}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy='single_host_origin'
                    isSignedIn={false}
                  />
                </Container>
              </Box>
            )}
          </>
        )}
      </Stack>
    </Container>
  )
}
