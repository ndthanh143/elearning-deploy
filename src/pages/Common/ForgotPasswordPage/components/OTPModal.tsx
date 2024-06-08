import { Modal, Box, Typography, Fade } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { OTPInput } from './OTPInput'
import { useEffect } from 'react'

interface OTPModalProps {
  open: boolean
  handleClose: () => void
  onSuccess: (otp: string) => void
}

export const OTPModal = ({ open, onSuccess }: OTPModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm()

  const handleOTPComplete = (otp: string) => {
    if (otp.length === 6) {
      onSuccess(otp)
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
                <OTPInput control={control} length={6} onComplete={handleOTPComplete} {...field} />
              )}
            />
          </form>
        </Box>
      </Fade>
    </Modal>
  )
}
