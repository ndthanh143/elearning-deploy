import { Container, Stack } from '@mui/material'
import { ScheduleBoard } from './containers'
import { userKeys } from '@/services/user/user.query'
import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'lodash'

export const SchedulePage = () => {
  const scheduleInstance = userKeys.schedule()
  const { data } = useQuery(scheduleInstance)

  const assignments = data?.assignmentsInfo.map((assignment) => assignment)
  const quizzes = data?.quizzesInfo.map((quiz) => quiz)

  const sortQuizzes = sortBy(quizzes, (quiz) => quiz.quizInfo.endDate)
  const sortAssignments = sortBy(assignments, (assignment) => assignment.assignmentInfo.endDate)

  return (
    <Container sx={{ my: 4 }}>
      <Stack>
        <ScheduleBoard quizzes={sortQuizzes || []} />
      </Stack>
    </Container>
  )
}
