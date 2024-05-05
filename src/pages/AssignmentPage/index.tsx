import { Grid } from '@mui/material'
import { AssignmentContent, SubmissionContent } from './containers'
import { useParams } from 'react-router-dom'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { useQuery } from '@tanstack/react-query'

export const AssignmentPage = () => {
  const { assignmentId, courseId, unitId } = useParams()

  const assignmentInstance = assignmentKeys.detail(Number(assignmentId))
  const { data: assignment } = useQuery({ ...assignmentInstance, enabled: Boolean(assignmentId) })

  if (!assignment) {
    return null
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <AssignmentContent assignment={assignment} />
        </Grid>
        <Grid item xs={4}>
          <SubmissionContent assignment={assignment} courseId={Number(courseId)} unitId={Number(unitId)} />
        </Grid>
      </Grid>
    </>
  )
}
