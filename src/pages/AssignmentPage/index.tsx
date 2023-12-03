import { Grid } from '@mui/material'
import { AssignmentContent, SubmissionContent } from './containers'
import { useParams } from 'react-router-dom'

export const AssignmentPage = () => {
  const { assignmentId } = useParams()
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <AssignmentContent assignmentId={assignmentId} />
        </Grid>
        <Grid item xs={4}>
          <SubmissionContent assignmentId={assignmentId} />
        </Grid>
      </Grid>
    </>
  )
}
