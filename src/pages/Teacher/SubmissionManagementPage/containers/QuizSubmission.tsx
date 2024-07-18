import { CustomSelect, Flex, Loading, NoData } from '@/components'
import { quizSubmissionKeys } from '@/services/quizSubmission/query'
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
import { useEffect, useState } from 'react'
import { Course } from '@/services/course/course.dto'
import { Filter, QuizStatistic } from '../components'
import { quizKey } from '@/services/quiz/quiz.query'

const DEFAULT_LIMIT = 12
export const QuizSubmission = ({ courses }: { courses: Course[] }) => {
  const [page, setPage] = useState(0)

  const [selectedCourseId, setSelectedCourseId] = useState<number>()
  const [selectedQuizId, setSelectedQuizId] = useState<number>()

  const quizSubmissionInstance = quizSubmissionKeys.list({
    courseId: selectedCourseId,
    quizId: selectedQuizId,
    page: page,
    size: DEFAULT_LIMIT,
  })
  const {
    data: quizSubmissions,
    isLoading,
    isFetched,
    refetch: refetchQuizSubmissions,
  } = useQuery({
    ...quizSubmissionInstance,
  })

  const quizInstance = quizKey.list({ courseId: Number(selectedCourseId) })
  const { data: quizzes, refetch: refetchQuizzes } = useQuery({
    ...quizInstance,
    enabled: Boolean(selectedCourseId),
    select: (data) => data.content,
  })

  const filterQuizSubmissions = groupBy(quizSubmissions?.content, (data) => data.studentInfo.id)

  const data = mapValues(filterQuizSubmissions, (submissions) => {
    return maxBy(submissions, 'score')
  })

  const filterData = Object.values(data)

  const headings = ['Student', 'Date', 'Score', 'Total time']

  useEffect(() => {
    if (selectedCourseId) {
      refetchQuizzes()
    }
  }, [selectedCourseId])

  useEffect(() => {
    if (selectedQuizId) {
      refetchQuizSubmissions()
    }
  }, [selectedQuizId])

  return (
    <Stack gap={2}>
      <Flex justifyContent='space-between'>
        <Typography fontWeight={700} variant='body1'>
          Quiz
        </Typography>
        <Filter selectedCourses={selectedCourseId} courses={courses} onChangeCourse={setSelectedCourseId} />
      </Flex>
      <Stack gap={4}>
        <Card elevation={0}>
          <CardContent>
            <Flex justifyContent='space-between'>
              <Typography variant='body1' fontWeight={700} mb={1}>
                List submissions
              </Typography>
              <CustomSelect
                data={[
                  { label: 'All', value: 'all' },
                  ...(quizzes ? quizzes.map((item) => ({ label: item.quizTitle, value: item.id })) : []),
                ]}
                value={selectedQuizId || 'all'}
                size='small'
                onChange={(e) => setSelectedQuizId(Number(e.target.value) ? Number(e.target.value) : undefined)}
              />
            </Flex>
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
