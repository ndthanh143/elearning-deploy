import { Container, Grid } from '@mui/material'
import { AssignmentContent, SubmissionContent } from './containers'
import { useParams } from 'react-router-dom'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks'
import { RoleEnum } from '@/services/auth/auth.dto'

export const AssignmentPage = () => {
  const { profile } = useAuth()
  const { assignmentId, courseId, unitId } = useParams()

  const assignmentInstance = assignmentKeys.detail(Number(assignmentId))
  const { data: assignment } = useQuery({ ...assignmentInstance, enabled: Boolean(assignmentId) })

  if (!assignment) {
    return null
  }

  return (
    profile && (
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={profile.data.role === RoleEnum.Student ? 8 : 12}>
            <AssignmentContent assignment={assignment} />
          </Grid>
          {profile.data.role === RoleEnum.Student && (
            <Grid item xs={4}>
              <SubmissionContent assignment={assignment} courseId={Number(courseId)} unitId={Number(unitId)} />
            </Grid>
          )}
        </Grid>
      </Container>
    )
  )
}
