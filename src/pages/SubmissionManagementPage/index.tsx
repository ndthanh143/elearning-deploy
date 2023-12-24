import { BoxContent, NoData } from '@/components'
import { useAuth } from '@/hooks'
import { Assignment } from '@/services/assignment/assignment.dto'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { courseKeys } from '@/services/course/course.query'
import { Quiz } from '@/services/quiz/quiz.dto'
import { quizKey } from '@/services/quiz/quiz.query'
import { AssignmentOutlined } from '@mui/icons-material'
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AssignmentSubmission, QuizSubmission } from './components'

export const SubmissionManagementPage = () => {
  const { profile } = useAuth()

  const [type, setType] = useState('assignment')

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  const coursesInstance = courseKeys.list({ teacherId: profile?.data.id })
  const { data: courses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile?.data.id),
    select: (data) => data.content,
  })

  const assignmentsInstance = assignmentKeys.list({ courseId: Number(selectedCourseId) })
  const { data: assignments } = useQuery({
    ...assignmentsInstance,
    enabled: Boolean(selectedCourseId),
    select: (data) => data.content,
  })

  const quizzesInstance = quizKey.list({ courseId: Number(selectedCourseId) })
  const { data: quizzes } = useQuery({
    ...quizzesInstance,
    enabled: Boolean(selectedCourseId),
    select: (data) => data.content,
  })

  useEffect(() => {
    if (courses) {
      setSelectedCourseId(courses[0]?.id)
    }
  }, [courses])

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <BoxContent height='80vh'>
          <Stack gap={2}>
            <Select
              size='small'
              value={type}
              onChange={(e) => setType(e.target.value as string)}
              sx={{ borderRadius: 3, width: 'fit-content' }}
            >
              <MenuItem value='assignment'>Assignment</MenuItem>
              <MenuItem value='quiz'>Quiz</MenuItem>
            </Select>
            <Select
              size='small'
              fullWidth
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value as number)}
              sx={{ borderRadius: 3 }}
            >
              {courses?.map((course) => <MenuItem value={course.id}>{course.courseName}</MenuItem>)}
            </Select>
          </Stack>
          {!assignments?.length && (
            <Box display='flex' alignItems='center' height='100%'>
              <NoData title='No assignments' />
            </Box>
          )}
          <List sx={{ height: '65vh', overflowY: 'scroll' }}>
            {type === 'assignment' &&
              assignments?.map((assignment) => (
                <ListItem key={assignment.id} onClick={() => setSelectedAssignment(assignment)}>
                  <ListItemButton
                    sx={{ bgcolor: assignment === selectedAssignment ? blue[50] : 'inherit', borderRadius: 3 }}
                  >
                    <ListItemIcon>
                      <AssignmentOutlined />
                    </ListItemIcon>
                    <ListItemText>{assignment.assignmentTitle}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            {type === 'quiz' &&
              quizzes?.map((quiz) => (
                <ListItem key={quiz.id} onClick={() => setSelectedQuiz(quiz)}>
                  <ListItemButton sx={{ bgcolor: quiz === selectedQuiz ? blue[50] : 'inherit', borderRadius: 3 }}>
                    <ListItemIcon>
                      <AssignmentOutlined />
                    </ListItemIcon>
                    <ListItemText>{quiz.quizTitle}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </BoxContent>
      </Grid>
      <Grid item xs={8}>
        <BoxContent height='80vh'>
          {type === 'assignment' && selectedAssignment && selectedCourseId && (
            <AssignmentSubmission assignmentId={selectedAssignment.id} courseId={selectedCourseId} />
          )}
          {type === 'quiz' && selectedQuiz && selectedCourseId && (
            <QuizSubmission quizId={selectedQuiz.id} courseId={selectedCourseId} />
          )}
        </BoxContent>
      </Grid>
    </Grid>
  )
}
