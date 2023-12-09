import { Box, CircularProgress } from '@mui/material'

export const Loading = () => {
  return (
    <Box display='flex' width={50} mx='auto'>
      <CircularProgress />
    </Box>
  )
}
