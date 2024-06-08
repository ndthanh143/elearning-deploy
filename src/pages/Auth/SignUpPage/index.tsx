import { object, string } from 'yup'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material'
import { Box, Button, Container, IconButton, Stack, Typography } from '@mui/material'

import { images } from '@/assets/images'
import { Flex, Link } from '@/components'
import { SignUpForm } from './components'
import { icons } from '@/assets/icons'

const schema = object({
  email: string().required('Please fill in your username'),
  password: string().required('Please fill in your password'),
})

export const SignUpPage = () => {
  const { handleSubmit } = useForm({ resolver: yupResolver(schema) })

  console.log('handleSubmit', handleSubmit)

  const [mode, setMode] = useState<'teacher' | 'student' | 'default'>('default')

  const toggleMode = (role: 'teacher' | 'student' | 'default') => () => {
    setMode(role)
  }

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
          <Typography variant='body2'>Have an account?</Typography>
          <Link href='/login' variant='body2' sx={{ textDecoration: 'none' }}>
            Log in
          </Link>
        </Flex>
      </Flex>
      <Stack
        width='100%'
        height='calc(100vh - 200px)'
        justifyContent={mode === 'default' ? 'center' : 'start'}
        alignItems='center'
        gap={6}
        mt={mode === 'default' ? 0 : 4}
      >
        {mode === 'default' ? (
          <>
            <Stack alignItems='center' gap={2}>
              <Box width={100} height={100}>
                {icons['education']}
              </Box>
              <Typography variant='h4'>Start using Edpuzzle, stop boring classes in their tracks.</Typography>
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
            <Box width='100%'>
              <Container maxWidth='xs'>
                <SignUpForm type={mode} />
              </Container>
            </Box>

            <Box width='100%' component='form'>
              <Container maxWidth='xs'>
                <Stack gap={2}>
                  {/* <Box
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
                  /> */}
                </Stack>
              </Container>
            </Box>
          </>
        )}
      </Stack>
    </Container>
  )
}
