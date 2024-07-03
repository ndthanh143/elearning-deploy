import { Button, Container, Grid } from '@mui/material'
import { AssignmentContent, SubmissionContent } from './containers'
import { useParams } from 'react-router-dom'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks'
import { RoleEnum } from '@/services/auth/auth.dto'
import { ArrowBackRounded } from '@mui/icons-material'
import { NotFound } from '@/components'

export const AssignmentPage = () => {
  const { profile } = useAuth()
  const { assignmentId, courseId, unitId } = useParams()

  const assignmentInstance = assignmentKeys.detail(Number(assignmentId))
  const { data: assignment, isFetched: isFetchedAssignment } = useQuery({
    ...assignmentInstance,
    enabled: Boolean(assignmentId),
  })

  const handleBack = () => {
    window.history.back()
  }

  if (!assignment && isFetchedAssignment) {
    return <NotFound />
  }

  return (
    profile &&
    assignment && (
      <Container>
        <Button startIcon={<ArrowBackRounded />} color='secondary' onClick={handleBack} sx={{ mb: 1 }}>
          Back
        </Button>
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
