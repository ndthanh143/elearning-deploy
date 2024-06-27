import common from '@/assets/images/icons/common'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function ResetPasswordSuccess() {
  const navigate = useNavigate()
  const redirectLogin = () => {
    navigate('/login')
  }
  return (
    <Stack justifyContent='center' alignItems='center' gap={2} height='100vh'>
      <Box width={200} height={200}>
        <Box component='img' src={common['success']} width='100%' height='100%' />
      </Box>
      <Typography>Your password has been reset successfully. Please login with your new password.</Typography>
      <Button variant='contained' sx={{ mt: 2 }} size='large' onClick={redirectLogin}>
        Login now
      </Button>
    </Stack>
  )
}
