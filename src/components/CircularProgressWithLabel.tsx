import { gray } from '@/styles/theme'
import { Box, CircularProgress, type CircularProgressProps } from '@mui/material'
import { PropsWithChildren } from 'react'

export function CircularProgressWithLabel({
  children,
  ...props
}: PropsWithChildren<CircularProgressProps & { value: number }>) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant='determinate' sx={{ position: 'absolute', color: gray[200] }} value={100} />
      <CircularProgress variant='determinate' {...props} />

      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
