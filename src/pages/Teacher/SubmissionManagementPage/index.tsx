import { Container, Divider, Stack } from '@mui/material'
import { AssignmentSubmission, QuizSubmission } from './containers'
import { courseKeys } from '@/services/course/course.query'
import { useAuth } from '@/hooks'
import { useQuery } from '@tanstack/react-query'

export const SubmissionManagementPage = () => {
  const { profile } = useAuth()
  const coursesInstance = courseKeys.list({ teacherId: profile?.data.id })
  const { data: courses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile?.data.role === 'Teacher'),
    select: (data) => data.content,
  })

  return (
    <Container>
      <Stack gap={4}>
        <Stack gap={4}>
          <AssignmentSubmission courses={courses || []} />
          <Divider sx={{ bgcolor: 'primary.main', py: 0.5, borderRadius: 3, width: 200, mx: 'auto', my: 4 }} />
          <QuizSubmission courses={courses || []} />
        </Stack>
      </Stack>
    </Container>
  )
}
