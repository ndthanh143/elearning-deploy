import { icons } from '@/assets/icons'
import { Button } from '@/components'
import { gray } from '@/styles/theme'
import { Box, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import { UseFormReturn } from 'react-hook-form'

interface IFormForgotPasswordProps {
  form: UseFormReturn<
    {
      email: string
    },
    any,
    undefined
  >
  onSubmit: (data: { email: string }) => void
  isLoading: boolean
}

export function FormForgotPassword({ isLoading = false, form, onSubmit }: IFormForgotPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form
  return (
    <Box component='form' onSubmit={handleSubmit(onSubmit)}>
      <Stack maxWidth={500} gap={4}>
        <Stack gap={2} justifyContent='center' alignItems='center'>
          <Box width={100} height={100}>
            {icons['lock']}
          </Box>
          <Typography variant='h2' textAlign='center' fontWeight={700}>
            Forgot your password?
          </Typography>
          <Typography color={gray[400]} textAlign='center' variant='body2'>
            No problem! Just enter the email you used to create your Brainstone account or the one you used to sign in
            with Google.
          </Typography>
        </Stack>
        <Stack gap={0.5}>
          <TextField fullWidth placeholder='Type your email to reset password' {...register('email')} />
          {errors.email && (
            <Typography color='error' variant='body2'>
              {errors.email.message}
            </Typography>
          )}
        </Stack>
        <Button type='submit' variant='contained' size='large' disabled={isLoading} sx={{ height: 45 }}>
          {isLoading ? <CircularProgress size={20} sx={{ my: 0.5 }} /> : 'Reset Password'}
        </Button>
      </Stack>
    </Box>
  )
}
