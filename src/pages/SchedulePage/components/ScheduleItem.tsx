import { blue } from '@/styles/theme'
import { AccessTime, Circle } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

export type ScheduleItemProps = {
  isActive?: boolean
  onClick?: () => void
}

export const ScheduleItem = ({ isActive, onClick }: ScheduleItemProps) => {
  return (
    <Stack
      gap={1}
      bgcolor={isActive ? blue[50] : 'transparent'}
      padding={isActive ? 2 : 0}
      borderRadius={3}
      sx={{
        transition: 'all ease 0.2s',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Stack direction='row' gap={2} mb={1}>
        <Circle color='primary' fontSize='small' />
        <Typography variant='body2'>08:00AM - 08:42AM</Typography>
      </Stack>
      <Typography fontWeight={500}>Test knowledge 2</Typography>
      <Typography textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>
        You checking in this test, after that, you trying to dosomething your best
      </Typography>
      <Stack direction='row' gap={1}>
        <AccessTime />
        <Typography>42min</Typography>
      </Stack>
    </Stack>
  )
}
