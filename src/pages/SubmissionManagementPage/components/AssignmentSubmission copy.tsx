import { Loading, NoData } from '@/components'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { formatDate } from '@/utils'
import { Box, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

type AssignmentSubmissionProps = {
  courseId: number
  assignmentId: number
}
export const AssignmentSubmission = ({ courseId, assignmentId }: AssignmentSubmissionProps) => {
  const assignmentSubmissionInstance = assignmentSubmissionKeys.list({
    courseId: courseId,
    assignmentId: assignmentId,
  })

  const {
    data: assignmentSubmissions,
    isLoading: isLoadingAssignmentSubmission,
    isFetched: isFetchedAssignmentSubmission,
  } = useQuery({ ...assignmentSubmissionInstance, enabled: Boolean(assignmentId) })

  const headings = ['Student', 'Date', 'File', 'Link', 'Text']

  return (
    <>
      {isLoadingAssignmentSubmission && (
        <Box display='flex' alignItems='center' height='100%'>
          <Loading />
        </Box>
      )}
      {(isFetchedAssignmentSubmission && !assignmentSubmissions?.content.length) ||
      !assignmentSubmissions?.content.length ? (
        <Box display='flex' alignItems='center' height='100%'>
          <NoData title='No data' />
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                {headings.map((item, index) => (
                  <TableCell key={item} align={!index ? 'left' : 'right'}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {assignmentSubmissions?.content.map((submission) => (
                <TableRow>
                  <TableCell>heading 1</TableCell>
                  <TableCell align='right'>{formatDate.toDateTime(new Date(submission.createDate))}</TableCell>
                  <TableCell align='right'>{submission.fileSubmissionUrl}</TableCell>
                  <TableCell align='right'>{submission.textSubmission}</TableCell>
                  <TableCell align='right'>{submission.linkSubmission}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={0} count={assignmentSubmissions?.totalPages} />
        </>
      )}
    </>
  )
}
