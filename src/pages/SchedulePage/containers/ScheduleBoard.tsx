import { BoxContent } from '@/components'
import { ArrowBack, ArrowForward, CalendarMonth } from '@mui/icons-material'
import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import { DateBox } from '../components'

export const ScheduleBoard = () => {
  return (
    <BoxContent>
      <Stack gap={4}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Stack direction='row' alignItems='center' gap={2}>
            <Typography variant='h5'>October 2023</Typography>
            <IconButton sx={{ borderRadius: '50%' }}>
              <CalendarMonth />
            </IconButton>
          </Stack>
          <Select defaultValue='weekly' size='small' sx={{ borderRadius: 3, paddingRight: 4 }}>
            <MenuItem value='weekly'>Weekly</MenuItem>
          </Select>
        </Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <IconButton>
            <ArrowBack />
          </IconButton>
          <Stack direction='row' gap={3}>
            {Array(7)
              .fill(null)
              .map((_, index) => (
                <DateBox isActive={index == 2} />
              ))}
          </Stack>
          <IconButton>
            <ArrowForward />
          </IconButton>
        </Stack>
      </Stack>
    </BoxContent>
  )
}
