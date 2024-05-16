import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material'
import { Box, Button, Container, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { configs } from '../../configs'
import { useAuth } from '../../hooks'
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
export const SignUpPage = () => {
  const navigate = useNavigate()

  const { state } = useLocation()

  const { handleSubmit } = useForm({ resolver: yupResolver(schema) })

  const { profile, loginGoogle, refetch } = useAuth()

  const { mutate: mutateLoginAdmin } = useMutation({
    mutationFn: authService.loginAdmin,
    onSuccess: () => {
      refetch()
      toast.success('Login by admin role successfully')
      navigate('/admin')
    },
  })

  const onSubmitHandler = (data: LoginAdminPayload) => {
    mutateLoginAdmin(data)
  }

  const responseGoogle = ({ accessToken }: any) => loginGoogle(accessToken)

  const [mode, setMode] = useState<'teacher' | 'student' | 'default'>('default')

  const toggleMode = (role: 'teacher' | 'student' | 'default') => () => {
    setMode(role)
  }

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
          <Link href='/login' variant='body2' sx={{ textDecoration: 'none' }}>
            Log in
          </Link>
        </Flex>
      </Flex>
      <Stack width='100%' height='calc(100vh - 200px)' justifyContent='center' alignItems='center' gap={6}>
        {mode === 'default' ? (
          <>
            <Typography variant='h4' maxWidth={500} textAlign='center'>
              Start using Edpuzzle, stop boring classes in their tracks.
            </Typography>
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
                  ? 'Hi, teacher! Level up your lessons with Edpuzzle.'
                  : 'Join Edpuzzle and unleash the power of video learning!'}
              </Typography>
              <IconButton sx={{ visibility: 'hidden' }}>
                <ArrowForwardOutlined />
              </IconButton>
            </Flex>
            <Box width='100%' component='form' onSubmit={handleSubmit(onSubmitHandler)}>
              <Container maxWidth='xs'>
                <Stack gap={2}>
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
                    clientId={clientId}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy='single_host_origin'
                    isSignedIn={false}
                  />
                  <Divider>Or</Divider>
                  <Button fullWidth variant='contained' sx={{ py: 1 }}>
                    Sign up with Brainstone
                  </Button>
                </Stack>
              </Container>
            </Box>
          </>
        )}
      </Stack>
    </Container>
  )
}
