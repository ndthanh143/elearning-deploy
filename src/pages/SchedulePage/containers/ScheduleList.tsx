import { BoxContent } from '@/components'
import { Stack, Typography } from '@mui/material'
import { ScheduleItem } from '../components'

export const ScheduleList = () => {
  return (
    <BoxContent>
      <Typography variant='h5' fontWeight={500} mb={4}>
        Today
      </Typography>
      <Stack gap={4}>
        <ScheduleItem isActive />
        <ScheduleItem />
        <ScheduleItem />
      </Stack>
    </BoxContent>
  )
}
