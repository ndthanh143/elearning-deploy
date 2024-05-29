import { Box, CircularProgress } from '@mui/material'

export const Loading = () => {
  return (
    <Box mx='auto'>
      <CircularProgress sx={{ width: 30, height: 30 }} />
    </Box>
  )
}
