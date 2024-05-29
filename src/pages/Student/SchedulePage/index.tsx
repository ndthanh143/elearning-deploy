import { Container, Stack } from '@mui/material'
import { ScheduleBoard } from './containers'
import { userKeys } from '@/services/user/user.query'
import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'lodash'
import { BannerHeading } from '../HomePage/components'

export const SchedulePage = () => {
  const scheduleInstance = userKeys.schedule()
  const { data } = useQuery(scheduleInstance)

  const assignments = data?.assignmentsInfo.map((assignment) => assignment)
  const quizzes = data?.quizzesInfo.map((quiz) => quiz)

  const sortQuizzes = sortBy(quizzes, (quiz) => quiz.quizInfo.endDate)
  const sortAssignments = sortBy(assignments, (assignment) => assignment.assignmentInfo.endDate)

  return (
    <Container>
      <Stack gap={4}>
        <BannerHeading
          title='Investing in personal development improves mental health and quality of life'
          subtitle='Participate in at least one activity every day!'
        />
        <ScheduleBoard quizzes={sortQuizzes || []} />
      </Stack>
    </Container>
  )
}
