import { Modal, Box, Typography, Fade } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { OTPInput } from './OTPInput'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import authService from '@/services/auth/auth.service'
import { useAlert } from '@/hooks'

interface OTPModalProps {
  open: boolean
  handleClose: () => void
  resetHash: string
  onSuccess: (verifiedToken: string) => void
}

export const OTPModal = ({ open, resetHash, onSuccess }: OTPModalProps) => {
  const { triggerAlert } = useAlert()
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm()

  const { mutate: mutateVerifyOtp, isPending: isLoadingVerify } = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      if (data.verified && data.verifiedToken) {
        onSuccess(data.verifiedToken)
      } else {
        triggerAlert('OTP is invalid', 'error')
      }
    },
  })

  const handleOTPComplete = (otp: string) => {
    if (otp.length === 6) {
      mutateVerifyOtp({ otp, resetHash })
    }
  }

  useEffect(() => {
    if (isValid) {
      handleSubmit((data) => handleOTPComplete(data.otp))()
    }
  }, [isValid, handleSubmit])

  return (
    <Modal open={open} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant='h3' fontWeight={700} textAlign='center' mb={2}>
            Input OTP Code
          </Typography>
          <form>
            <Controller
              name='otp'
              control={control}
              render={({ field }) => (
                <OTPInput
                  control={control}
                  length={6}
                  disabled={isLoadingVerify}
                  onComplete={handleOTPComplete}
                  {...field}
                />
              )}
            />
          </form>
        </Box>
      </Fade>
    </Modal>
  )
}
