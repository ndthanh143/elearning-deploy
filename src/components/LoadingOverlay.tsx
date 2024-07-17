import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'

interface ILoadingOverlayProps {
  isOpen: boolean
  title?: string
}

export const LoadingOverlay = ({ isOpen, title = 'Loading...' }: ILoadingOverlayProps) => {
  return (
    <Backdrop open={isOpen}>
      <Stack justifyContent='center' alignItems='center' borderRadius={4} paddingX={10} paddingY={4} gap={2}>
        <CircularProgress sx={{ color: '#fff' }} />
        <Typography color='#fff' fontWeight={400} variant='h5' sx={{ userSelect: 'none' }}>
          {title}
        </Typography>
      </Stack>
    </Backdrop>
  )
}
