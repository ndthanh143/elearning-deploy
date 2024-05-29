import { Box, Typography } from '@mui/material'
import { Dayjs } from 'dayjs'

export type DateBoxProps = {
  date: Dayjs
  isActive?: boolean
  onClick: (date: Dayjs) => void
}
export const DateBox = ({ date, isActive, onClick }: DateBoxProps) => {
  const handleClick = () => {
    onClick(date)
  }
  return (
    <Box
      borderRadius={3}
      px={4}
      py={2}
      textAlign='center'
      border={1}
      borderColor={isActive ? 'primary.main' : 'inherit'}
      sx={{
        ':hover': {
          borderColor: 'primary.main',
        },
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Typography
        variant='h4'
        color={isActive ? 'primary' : 'inherit'}
        sx={{
          ':hover': {
            color: 'primary',
          },
        }}
      >
        {date.format('DD')}
      </Typography>
      <Typography
        color={isActive ? 'primary' : 'inherit'}
        sx={{
          ':hover': {
            color: 'primary',
          },
        }}
      >
        {date.format('dd')}
      </Typography>
    </Box>
  )
}
