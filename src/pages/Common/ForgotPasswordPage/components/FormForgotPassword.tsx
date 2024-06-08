import { icons } from '@/assets/icons'
import { Button } from '@/components'
import { gray } from '@/styles/theme'
import { Box, Stack, TextField, Typography } from '@mui/material'
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
}

export function FormForgotPassword({ form, onSubmit }: IFormForgotPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { isValid },
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
        <TextField fullWidth placeholder='Type your email to reset password' {...register('email')} />
        <Button type='submit' variant='contained' size='large' disabled={!isValid}>
          Reset Password
        </Button>
      </Stack>
    </Box>
  )
}
