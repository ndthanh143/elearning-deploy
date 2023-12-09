import { BoxContent, NoData, Show } from '@/components'
import { MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material'
import { AssignmentItem, QuizItem } from '../components'
import { AssignmentsInfo, QuizzesInfo } from '@/services/user/user.dto'
import { useState } from 'react'

export type ScheduleListProps = {
  assignments: AssignmentsInfo[]
  quizzes: QuizzesInfo[]
}

type TypeSchedule = 'quiz' | 'assignment'

export const ScheduleList = ({ assignments, quizzes }: ScheduleListProps) => {
  const [type, setType] = useState<TypeSchedule>('quiz')

  const [selectedQuiz, setSelectedQuiz] = useState(quizzes[0])
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0])

  const handleChangeType = (e: SelectChangeEvent) => {
    setType(e.target.value as TypeSchedule)
  }
  return (
    <BoxContent>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
        <Typography variant='h5' fontWeight={500}>
          Your schedule
        </Typography>
        <Select
          defaultValue={type}
          size='small'
          sx={{ borderRadius: 3, paddingRight: 4, minWidth: 100 }}
          onChange={handleChangeType}
        >
          <MenuItem value='quiz'>Quiz</MenuItem>
          <MenuItem value='assignment'>Assignment</MenuItem>
        </Select>
      </Stack>
      <Stack gap={4} sx={{ overflowY: 'scroll', height: '65vh' }}>
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
    </BoxContent>
  )
}
