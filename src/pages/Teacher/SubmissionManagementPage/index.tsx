import { Container, Stack } from '@mui/material'
import { AssignmentSubmission, QuizSubmission } from './containers'

export const SubmissionManagementPage = () => {
  return (
    <Container>
      <Stack gap={4}>
        <Stack gap={4}>
          <AssignmentSubmission />
          {/* <QuizSubmission /> */}
        </Stack>
      </Stack>
    </Container>
  )
}
