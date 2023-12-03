import { CircleOutlined, RadioButtonCheckedOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

export type HeadingItemProps = {
  title: string
  isActive?: boolean
  onClick?: () => void
}

export const HeadingItem = ({ title, isActive, onClick }: HeadingItemProps) => {
  return (
    <Stack direction='row' gap={1} sx={{ cursor: 'pointer' }} onClick={onClick}>
      {isActive ? <RadioButtonCheckedOutlined fontSize='small' color='primary' /> : <CircleOutlined fontSize='small' />}
      <Typography
        color={isActive ? 'primary' : 'inherit'}
        sx={{
          ':hover': {
            color: 'primary.main',
          },
        }}
      >
        {title}
      </Typography>
    </Stack>
  )
}
