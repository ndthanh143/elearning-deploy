import { PropsWithChildren } from 'react'
import { Box, BoxProps } from '@mui/material'

export const BoxContent = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
  return (
    <Box bgcolor='#fff' padding={2} borderRadius={3} {...props}>
      {children}
    </Box>
  )
}
