import { Box, CircularProgress } from '@mui/material'
import { PropsWithChildren } from 'react'

interface ILoadingContainerProps extends PropsWithChildren {
  loading: boolean
}

export function LoadingContainer({ children, loading }: ILoadingContainerProps) {
  return (
    <Box position='relative'>
      {children}
      {loading && (
        <Box position='absolute' sx={{ inset: '0', zIndex: 10 }}>
          <Box position='absolute' top='50%' left='50%' sx={{ transform: 'translate(-50%,-50%)' }}>
            <CircularProgress color='primary' />
          </Box>
        </Box>
      )}
    </Box>
  )
}
