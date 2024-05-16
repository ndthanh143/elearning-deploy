import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'

interface ILoadingOverlayProps {
  isOpen: boolean
  title?: string
}

export const LoadingOverlay = ({ isOpen, title = 'Loading...' }: ILoadingOverlayProps) => {
  return (
    <Backdrop open={isOpen}>
      <Stack
        justifyContent='center'
        alignItems='center'
        bgcolor='white'
        borderRadius={4}
        paddingX={10}
        paddingY={4}
        gap={2}
      >
        <CircularProgress color='primary' />
        <Typography>{title}</Typography>
      </Stack>
    </Backdrop>
  )
}
