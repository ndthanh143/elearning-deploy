import { icons } from '@/assets/icons'
import { Button } from '@/components'
import { gray } from '@/styles/theme'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { UseFormReturn } from 'react-hook-form'

interface IFormResetPasswordProps {
  form: UseFormReturn<
    {
      newPassword: string
      confirmPassword: string
      verifiedToken: string
    },
    any,
    undefined
  >
  onSubmit: (data: { verifiedToken: string; confirmPassword: string; newPassword: string }) => void
}

export function FormResetPassword({ form, onSubmit }: IFormResetPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
        <Stack gap={0.5}>
          <TextField fullWidth type='password' placeholder='Password' {...register('newPassword')} />
          {errors.newPassword && (
            <Typography color='error' variant='body2'>
              {errors.newPassword.message}
            </Typography>
          )}
        </Stack>
        <Stack gap={0.5}>
          <TextField fullWidth type='password' placeholder='Confirm your password' {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <Typography color='error' variant='body2'>
              {errors.confirmPassword.message}
            </Typography>
          )}
        </Stack>
        <Button type='submit' variant='contained' size='large'>
          Reset Password
        </Button>
      </Stack>
    </Box>
  )
}
