import { Container, Stack } from '@mui/material'
import { TaskCalendar } from './containers'
import { BannerHeading } from '../HomePage/components'

export const SchedulePage = () => {
  return (
    <Container>
      <Stack gap={4}>
        <BannerHeading
          title='Investing in personal development improves mental health and quality of life'
          subtitle='Participate in at least one activity every day!'
        />
        <TaskCalendar />
      </Stack>
    </Container>
  )
}
