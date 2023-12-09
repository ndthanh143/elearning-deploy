import { NoData } from '@/components'
import { ScheduleList } from '@/pages/SchedulePage/containers'
import { userKeys } from '@/services/user/user.query'
import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'lodash'

export const ListSchedule = () => {
  const userInstance = userKeys.schedule()
  const { data } = useQuery(userInstance)

  if (!data) {
    return <NoData title='You dont have any tasks rest' />
  }

  const filteredQuiz = sortBy(data.quizzesInfo, (quiz) => {
    return quiz.quizInfo.endDate
  })

  const filteredAssignment = sortBy(data.assignmentsInfo, (assignment) => {
    return assignment.assignmentInfo.endDate
  })

  return <ScheduleList assignments={filteredAssignment} quizzes={filteredQuiz} />
}
