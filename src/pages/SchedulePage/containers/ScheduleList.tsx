import { NoData, Show } from '@/components'
import { Card, CardContent, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material'
import { AssignmentItem, QuizItem } from '../components'
import { AssignmentsInfo, QuizzesInfo } from '@/services/user/user.dto'
import { useEffect, useState } from 'react'
import { scrollToElement } from '@/utils'
import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'

export type ScheduleListProps = {
  assignments: AssignmentsInfo[]
  quizzes: QuizzesInfo[]
}

type TypeSchedule = 'quiz' | 'assignment'

export const ScheduleList = ({ assignments, quizzes }: ScheduleListProps) => {
  const [type, setType] = useState<TypeSchedule>('quiz')

  let [_, setSearchParams] = useSearchParams()

  const [selectedQuiz, setSelectedQuiz] = useState(quizzes[0])
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0])

  const handleChangeType = (e: SelectChangeEvent) => {
    setType(e.target.value as TypeSchedule)
  }

  useEffect(() => {
    if (selectedQuiz) {
      setSearchParams({ date: dayjs(selectedQuiz.quizInfo.endDate).toString() })
      scrollToElement(selectedQuiz.quizInfo.id.toString())
    }
  }, [selectedQuiz])

  return (
    <Card>
      <CardContent>
        <Typography variant='h5' fontWeight={500} mb={2}>
          Your tasks
        </Typography>
        <Select defaultValue={type} size='small' fullWidth sx={{ borderRadius: 3 }} onChange={handleChangeType}>
          <MenuItem value='quiz'>Quiz</MenuItem>
          <MenuItem value='assignment'>Assignment</MenuItem>
        </Select>
        <Stack gap={4} sx={{ overflowY: 'scroll', height: '65vh' }} mt={2}>
          <Show when={type === 'quiz'}>
            {quizzes.map((quiz) => (
              <QuizItem
                isActive={selectedQuiz === quiz}
                quizData={quiz}
                key={`${quiz.quizInfo.id}-${quiz.courseInfo.id}`}
                onClick={() => setSelectedQuiz(quiz)}
              />
            ))}
            {!quizzes.length && <NoData title='You have no quizzes schedule!' />}
          </Show>
          <Show when={type === 'assignment'}>
            {assignments.map((assignment) => (
              <AssignmentItem
                isActive={assignment === selectedAssignment}
                assignmentData={assignment}
                key={`${assignment.assignmentInfo.id}-${assignment.courseInfo.id}`}
                onClick={() => setSelectedAssignment(assignment)}
              />
            ))}
            {!assignments.length && <NoData title='You have no assignments schedule!' />}
          </Show>
        </Stack>
      </CardContent>
    </Card>
  )
}
