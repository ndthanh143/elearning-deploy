import { Loading, NoData } from '@/components'
import { quizSubmissionKeys } from '@/services/quizSubmission/query'
import { userKeys } from '@/services/user/user.query'
import { convertMilisecond, formatDate } from '@/utils'
import { Box, Button, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { groupBy, mapValues, maxBy } from 'lodash'
import { useState } from 'react'
import { ModalUnsubmit } from '.'
import { useBoolean } from '@/hooks'

type QuizSubmissionProps = {
  courseId: number
  quizId: number
}
const DEFAULT_LIMIT = 12
export const QuizSubmission = ({ courseId, quizId }: QuizSubmissionProps) => {
  const [page, setPage] = useState(0)
  const { value: isOpenUnsubmit, setTrue: openUnsubmit, setFalse: closeUnsubmit } = useBoolean(false)

  const quizSubmissionInstance = quizSubmissionKeys.list({ courseId, quizId, page: page, size: DEFAULT_LIMIT })
  const {
    data: quizSubmissions,
    isLoading,
    isFetched,
  } = useQuery({
    ...quizSubmissionInstance,
  })

  const studentsInstance = userKeys.list({ courseId: Number(courseId) })
  const { data: students } = useQuery({
    ...studentsInstance,
    enabled: Boolean(courseId && quizSubmissions),
    select: (data) => {
      return data.content.filter(
        (student) => !quizSubmissions?.content.find((item) => item.studentInfo.id === student.id),
      )
    },
  })

  const filterQuizSubmissions = groupBy(quizSubmissions?.content, (data) => data.studentInfo.id)

  const data = mapValues(filterQuizSubmissions, (submissions) => {
    const highestScore = maxBy(submissions, 'score')
    console.log('highestScore', highestScore)
    return highestScore
  })

  const filterData = Object.values(data)

  const headings = ['Student', 'Date', 'Score', 'Total time']

  return (
    <Stack height='100%' justifyContent='space-between'>
      {students?.length && <ModalUnsubmit isOpen={isOpenUnsubmit} onClose={closeUnsubmit} data={students} />}
      <Box>
        {students?.length && <Button onClick={openUnsubmit}>View Unsubmitted students</Button>}
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
          <Stack>
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
                {filterData?.map(
                  (submission) =>
                    submission && (
                      <TableRow>
                        <TableCell>{submission.studentInfo.fullName}</TableCell>
                        <TableCell>{formatDate.toDateTime(new Date(submission.createDate))}</TableCell>
                        <TableCell>{submission.score.toFixed(2)}</TableCell>
                        <TableCell align='right'>{convertMilisecond(submission.totalTime)}</TableCell>
                      </TableRow>
                    ),
                )}
              </TableBody>
            </Table>
          </Stack>
        )}
      </Box>

      <Pagination
        page={page + 1}
        onChange={(_, page) => setPage(page - 1)}
        count={quizSubmissions?.totalPages}
        sx={{ mt: 2, justifyContent: 'center', display: 'start' }}
      />
    </Stack>
  )
}
