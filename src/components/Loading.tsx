import { Box, CircularProgress } from '@mui/material'

export const Loading = () => {
  return (
    <Box display='flex' width={30} height={30} mx='auto'>
      <CircularProgress />
    </Box>
  )
}
