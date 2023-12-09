import { PageContentHeading } from '@/components'
import { Box, Grid } from '@mui/material'
import { ScheduleBoard, ScheduleList } from './containers'
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
    assignments &&
    quizzes && (
      <Box>
        <PageContentHeading />
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <ScheduleList assignments={sortAssignments} quizzes={sortQuizzes} />
          </Grid>
          <Grid item xs={8}>
            <ScheduleBoard quizzes={sortQuizzes || []} />
          </Grid>
        </Grid>
      </Box>
    )
  )
}
