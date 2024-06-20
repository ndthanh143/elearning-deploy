import { Flex, Loading, NoData } from '@/components'
import { quizSubmissionKeys } from '@/services/quizSubmission/query'
import { userKeys } from '@/services/user/user.query'
import { convertMilisecond, formatDate } from '@/utils'
import {
  Box,
  Card,
  CardContent,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { groupBy, mapValues, maxBy } from 'lodash'
import { useState } from 'react'
import { Course } from '@/services/course/course.dto'
import { Filter, QuizStatistic } from '../components'

const DEFAULT_LIMIT = 12
export const QuizSubmission = ({ courses }: { courses: Course[] }) => {
  const [page, setPage] = useState(0)

  const [courseId, _] = useState<Number>()

  const quizSubmissionInstance = quizSubmissionKeys.list({ page: page, size: DEFAULT_LIMIT })
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

  console.log('students', students)

  const filterQuizSubmissions = groupBy(quizSubmissions?.content, (data) => data.studentInfo.id)

  const data = mapValues(filterQuizSubmissions, (submissions) => {
    return maxBy(submissions, 'score')
  })

  const filterData = Object.values(data)

  const headings = ['Student', 'Date', 'Score', 'Total time']

  return (
    <Stack gap={2}>
      <Flex justifyContent='space-between'>
        <Typography fontWeight={700} variant='body1'>
          Quiz
        </Typography>
        <Filter courses={courses} />
      </Flex>
      <Stack gap={4}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant='body1' fontWeight={700} mb={1}>
              List submissions
            </Typography>
            <Stack height='100%' justifyContent='space-between'>
              <Box>
                <Stack direction='row' justifyContent='space-between'></Stack>
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

              {quizSubmissions && quizSubmissions.totalPages > 1 && (
                <Pagination
                  page={page + 1}
                  onChange={(_, page) => setPage(page - 1)}
                  count={quizSubmissions?.totalPages}
                  sx={{ mt: 2, justifyContent: 'center', display: 'start' }}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
        {filterData && <QuizStatistic data={(filterData as any) || []} />}
      </Stack>
    </Stack>
  )
}
