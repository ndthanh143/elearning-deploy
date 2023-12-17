import { Loading, NoData } from '@/components'
import { quizSubmissionKeys } from '@/services/quizSubmission/query'
import { convertMilisecond, formatDate } from '@/utils'
import { Box, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type QuizSubmissionProps = {
  courseId: number
  quizId: number
}
const DEFAULT_LIMIT = 12
export const QuizSubmission = ({ courseId, quizId }: QuizSubmissionProps) => {
  const [page, setPage] = useState(0)

  const quizSubmissionInstance = quizSubmissionKeys.list({ courseId, quizId, page: page, size: DEFAULT_LIMIT })
  const {
    data: quizSubmissions,
    isLoading,
    isFetched,
  } = useQuery({
    ...quizSubmissionInstance,
  })

  const headings = ['Student', 'Date', 'Score', 'Total time']

  return (
    <>
      {isLoading && (
        <Box display='flex' alignItems='center' height='100%'>
          <Loading />
        </Box>
      )}
      {(isFetched && !quizSubmissions?.content.length) || !quizSubmissions?.content.length ? (
        <Box display='flex' alignItems='center' height='100%'>
          <NoData title='No data' />
        </Box>
      ) : (
        <Stack height='100%' justifyContent='space-between'>
          <Table>
            <TableHead>
              <TableRow>
                {headings.map((item, index) => (
                  <TableCell key={item} align={!(index === headings.length - 1) ? 'left' : 'right'}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {quizSubmissions?.content.map((submission) => (
                <TableRow>
                  <TableCell>heading 1</TableCell>
                  <TableCell>{formatDate.toDateTime(new Date(submission.createDate))}</TableCell>
                  <TableCell>{submission.score.toFixed(2)}</TableCell>
                  <TableCell align='right'>{convertMilisecond(submission.totalTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={page + 1}
            onChange={(_, page) => setPage(page - 1)}
            count={quizSubmissions?.totalPages}
            sx={{ mt: 2, justifyContent: 'center', display: 'start' }}
          />
        </Stack>
      )}
    </>
  )
}
