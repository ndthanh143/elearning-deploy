import { icons } from '@/assets/icons'
import { Button } from '@/components'
import { gray } from '@/styles/theme'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { UseFormReturn } from 'react-hook-form'

interface IFormResetPasswordProps {
  form: UseFormReturn<
    {
      password: string
      confirmPassword: string
      otp: string
    },
    any,
    undefined
  >
  onSubmit: (data: { otp: string; confirmPassword: string; password: string }) => void
}

export function FormResetPassword({ form, onSubmit }: IFormResetPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = form
  return (
    <Box component='form' onSubmit={handleSubmit(onSubmit)}>
      <Stack maxWidth={500} gap={4} minWidth={500}>
        <Stack gap={2} justifyContent='center' alignItems='center'>
          <Box width={100} height={100}>
            {icons['lock']}
          </Box>
          <Typography variant='h2' textAlign='center' fontWeight={700}>
            Reset Password!
          </Typography>
          <Typography color={gray[400]} textAlign='center' variant='body2'>
            Please enter your new password and confirm it.
          </Typography>
        </Stack>
        <TextField fullWidth type='password' placeholder='Password' {...register('password')} />
        <TextField fullWidth type='password' placeholder='Confirm your password' {...register('confirmPassword')} />
        <Button type='submit' variant='contained' size='large' disabled={!isValid}>
          Reset Password
        </Button>
      </Stack>
    </Box>
  )
}
