import { Box, Typography } from '@mui/material'

export type DateBoxProps = {
  isActive?: boolean
}
export const DateBox = ({ isActive }: DateBoxProps) => {
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
        8
      </Typography>
      <Typography
        color={isActive ? 'primary' : 'inherit'}
        sx={{
          ':hover': {
            color: 'primary',
          },
        }}
      >
        Mon
      </Typography>
    </Box>
  )
}
