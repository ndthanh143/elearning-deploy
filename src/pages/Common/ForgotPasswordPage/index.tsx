import { images } from '@/assets/images'
import { Flex, Link } from '@/components'
import { regexPattern } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Container, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { FormForgotPassword, FormResetPassword, OTPModal } from './components'
import { useBoolean } from '@/hooks'

const forgotPasswordSchema = object({
  email: string()
    .matches(regexPattern.emailValidation, 'Please input correct pattern of email')
    .required('Please fill in your email'),
})

const resetPasswordSchema = object({
  password: string().required('Please fill in your password'),
  confirmPassword: string().required('Please fill in your confirm password'),
  otp: string().required('Please fill in your OTP'),
})

export function ForgotPasswordPage() {
  const forgotPasswordForm = useForm({ resolver: yupResolver(forgotPasswordSchema) })
  const resetPasswordForm = useForm({ resolver: yupResolver(resetPasswordSchema) })

  const { value: isOpenOtpModal, setTrue: openOtpModal, setFalse: closeOtpModal } = useBoolean(false)

  const onSubmitHandler = (data: { email: string }) => {
    console.log(data)
    openOtpModal()
  }

  const handleResetPassword = (data: { otp: string; password: string; confirmPassword: string }) => {
    console.log('data', data)
  }

  const handleOtpSuccess = (otp: string) => {
    resetPasswordForm.setValue('otp', otp)
    closeOtpModal()
  }

  return (
    <>
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
        <Stack width='100%' height='calc(100vh - 200px)' justifyContent='center' alignItems='center' gap={6}>
          {resetPasswordForm.watch('otp') ? (
            <FormResetPassword form={resetPasswordForm} onSubmit={handleResetPassword} />
          ) : (
            <FormForgotPassword form={forgotPasswordForm} onSubmit={onSubmitHandler} />
          )}
        </Stack>
      </Container>
      <OTPModal open={isOpenOtpModal} handleClose={closeOtpModal} onSuccess={handleOtpSuccess} />
    </>
  )
}
