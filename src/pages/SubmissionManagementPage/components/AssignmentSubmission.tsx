import { Loading, NoData } from '@/components'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { formatDate } from '@/utils'
import { Box, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type AssignmentSubmissionProps = {
  courseId: number
  assignmentId: number
}

const DEFAULT_PAGE_LIMIT = 1
export const AssignmentSubmission = ({ courseId, assignmentId }: AssignmentSubmissionProps) => {
  const [page, setPage] = useState(1)

  const assignmentSubmissionInstance = assignmentSubmissionKeys.list({
    courseId: courseId,
    assignmentId: assignmentId,
    page: page - 1,
    size: DEFAULT_PAGE_LIMIT,
  })

  const {
    data: assignmentSubmissions,
    isLoading: isLoadingAssignmentSubmission,
    isFetched: isFetchedAssignmentSubmission,
  } = useQuery({ ...assignmentSubmissionInstance })

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
        <Stack justifyContent='space-between' height='100%'>
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
          <Pagination
            page={page}
            count={assignmentSubmissions?.totalPages}
            onChange={(_, page) => setPage(page)}
            sx={{ mt: 2 }}
          />
        </Stack>
      )}
    </>
  )
}
