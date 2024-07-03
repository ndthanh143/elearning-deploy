import { Flex, Link, Logo } from '@/components'
import { regexPattern } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Container, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, ref, string } from 'yup'
import { FormForgotPassword, FormResetPassword, OTPModal, ResetPasswordSuccess } from './components'
import { useBoolean } from '@/hooks'
import { useMutation } from '@tanstack/react-query'
import authService from '@/services/auth/auth.service'
import { useState } from 'react'

const forgotPasswordSchema = object({
  email: string()
    .matches(regexPattern.emailValidation, 'Please input correct pattern of email')
    .required('Please fill in your email'),
})

const resetPasswordSchema = object({
  newPassword: string().required('Please fill in your new password'),
  confirmPassword: string()
    .oneOf([ref('newPassword')], 'Confirm password must match new password')
    .required('Please fill in your confirm password'),
  verifiedToken: string().required('Verified token is required'),
})

export function ForgotPasswordPage() {
  const forgotPasswordForm = useForm({ resolver: yupResolver(forgotPasswordSchema) })
  const resetPasswordForm = useForm({ resolver: yupResolver(resetPasswordSchema) })

  const { value: isOpenSuccess, setTrue: openSuccess } = useBoolean(false)

  const [resetHash, setResetHash] = useState('')

  const { mutate: mutateRequestForgotPassword, isPending: isLoadingRequest } = useMutation({
    mutationFn: authService.requestForgotPassword,
    onSuccess: (data) => {
      setResetHash(data.resetHash)
    },
  })

  const { mutate: mutateResetPassword } = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      openSuccess()
    },
  })

  const onSubmitHandler = (data: { email: string }) => {
    mutateRequestForgotPassword({ email: data.email, roleKind: 3 })
  }

  const handleResetPassword = (data: { verifiedToken: string; newPassword: string; confirmPassword: string }) => {
    mutateResetPassword({ newPassword: data.newPassword, verifiedToken: data.verifiedToken })
  }

  const handleCloseOtpModal = () => {
    setResetHash('')
  }

  const handleOtpSuccess = (verifiedToken: string) => {
    resetPasswordForm.setValue('verifiedToken', verifiedToken)
    handleCloseOtpModal()
  }

  return isOpenSuccess ? (
    <ResetPasswordSuccess />
  ) : (
    <Container sx={{ my: 4 }}>
      <Flex justifyContent='space-between'>
        <Flex gap={2}>
          <Logo size='small' type='short' />
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
        {resetPasswordForm.watch('verifiedToken') ? (
          <FormResetPassword form={resetPasswordForm} onSubmit={handleResetPassword} />
        ) : (
          <FormForgotPassword isLoading={isLoadingRequest} form={forgotPasswordForm} onSubmit={onSubmitHandler} />
        )}
      </Stack>
      <OTPModal
        open={!!resetHash}
        handleClose={handleCloseOtpModal}
        onSuccess={handleOtpSuccess}
        resetHash={resetHash || ''}
      />
    </Container>
  )
}
