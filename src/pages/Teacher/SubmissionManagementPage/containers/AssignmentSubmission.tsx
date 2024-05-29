import { CustomSelect, Flex, Loading, NoData } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { ReviewSubmissionText } from '@/pages/Common/AssignmentPage/components'
import { Submission } from '@/services/assignmentSubmission/assignmentSubmission.dto'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { downloadFileByLink, formatDate } from '@/utils'
import { BlockOutlined, EditRounded, FileDownloadOutlined, VisibilityOutlined } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ModalEditScore, AssignmentStatistic } from '../components'
import { assignmentSubmissionService } from '@/services/assignmentSubmission/assignmentSubmission.service'
import { toast } from 'react-toastify'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { courseKeys } from '@/services/course/course.query'

const DEFAULT_PAGE_LIMIT = 1
export const AssignmentSubmission = () => {
  const { profile } = useAuth()
  const [page, setPage] = useState(1)

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const { value: isOpenEditScore, setTrue: openEditScore, setFalse: closeEditScore } = useBoolean(false)
  const { value: isOpenTextReview, setTrue: openTextReview, setFalse: closeTextReview } = useBoolean(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number>()
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>()

  const assignmentSubmissionInstance = assignmentSubmissionKeys.list({
    courseId: selectedAssignmentId,
    assignmentId: selectedAssignmentId,
    page: page - 1,
    size: DEFAULT_PAGE_LIMIT,
  })

  const {
    data: assignmentSubmissions,
    isLoading: isLoadingAssignmentSubmission,
    isFetched: isFetchedAssignmentSubmission,
    refetch: refetchSubmission,
  } = useQuery({ ...assignmentSubmissionInstance })

  const coursesInstance = courseKeys.list({ teacherId: profile?.data.id })
  const { data: courses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile?.data.role === 'Teacher'),
    select: (data) => data.content,
  })

  const assignmentsInstance = assignmentKeys.list({ courseId: selectedCourseId })
  const { data: assignments } = useQuery({
    ...assignmentsInstance,
    enabled: Boolean(selectedCourseId),
    select: (data) => data.content,
  })

  const selectDataTypeSubmit = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Submitted',
      value: 'submitted',
    },
    {
      label: 'Unsubmitted',
      value: 'unsubmitted',
    },
  ]

  const handleCloseReview = () => {
    setSelectedSubmission(null)
    closeTextReview()
  }

  const { mutate: mutateUpdateScore } = useMutation({
    mutationFn: assignmentSubmissionService.update,
    onSuccess: () => {
      refetchSubmission()
      toast.success('Update score successfully')
      closeEditScore()
      setSelectedSubmission(null)
    },
  })

  const handleSubmitScore = (score: number) => {
    if (selectedSubmission) {
      mutateUpdateScore({ id: selectedSubmission.id, score })
    }
  }

  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id)
    }
  }, [courses])

  const headings = ['Student', 'Submit date', 'File', 'Link', 'Text', 'Score', 'Action']

  return (
    <Stack gap={2}>
      <Flex justifyContent='space-between'>
        <Typography fontWeight={700}>Assignment</Typography>
        <Flex gap={2}>
          <CustomSelect
            data={
              courses?.map((course) => ({
                label: course.courseName,
                value: course.id,
              })) || []
            }
            defaultValue={selectedCourseId}
            size='small'
          />
          <CustomSelect data={selectDataTypeSubmit} defaultValue={selectDataTypeSubmit[0].value} size='small' />
        </Flex>
      </Flex>
      <Grid container spacing={4}>
        <Grid item xs={8} height='100%'>
          <Card sx={{ minHeight: '100%' }}>
            <CardContent>
              <Flex mb={1}>
                <Typography variant='body2' fontWeight={700}>
                  List submissions
                </Typography>
              </Flex>
              <Stack justifyContent='space-between' height='100%'>
                {isLoadingAssignmentSubmission ? (
                  <Box display='flex' alignItems='center' height='100%'>
                    <Loading />
                  </Box>
                ) : (
                  <Box>
                    {(isFetchedAssignmentSubmission && !assignmentSubmissions?.content.length) ||
                    !assignmentSubmissions?.content.length ? (
                      <Box display='flex' alignItems='center' height='100%'>
                        <NoData title='No submissions' />
                      </Box>
                    ) : (
                      <Stack justifyContent='space-between'>
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
                                <TableCell>{submission.studentInfo.fullName}</TableCell>
                                <TableCell align='right'>
                                  {formatDate.toDateTime(new Date(submission.createDate))}
                                </TableCell>
                                <TableCell align='right'>
                                  {submission.fileSubmissionUrl ? (
                                    <IconButton
                                      onClick={() => downloadFileByLink(String(submission.fileSubmissionUrl))}
                                    >
                                      <FileDownloadOutlined color='primary' />
                                    </IconButton>
                                  ) : (
                                    <Tooltip title='No data'>
                                      <BlockOutlined />
                                    </Tooltip>
                                  )}
                                </TableCell>
                                <TableCell align='right'>
                                  {submission.linkSubmission ? (
                                    <Tooltip title='View link submission'>
                                      <Link to={submission.linkSubmission} color='primary.main'>
                                        View
                                      </Link>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title='No data'>
                                      <BlockOutlined />
                                    </Tooltip>
                                  )}
                                </TableCell>
                                <TableCell align='right'>
                                  {submission.textSubmission ? (
                                    <Tooltip title='View text submission'>
                                      <IconButton
                                        onClick={() => {
                                          setSelectedSubmission(submission)
                                          openTextReview()
                                        }}
                                      >
                                        <VisibilityOutlined color='primary' />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title='No data'>
                                      <BlockOutlined />
                                    </Tooltip>
                                  )}
                                </TableCell>
                                <TableCell align='right'>
                                  {submission.score ? (
                                    <Chip color='primary' label={submission.score} />
                                  ) : (
                                    <Tooltip title='No data'>
                                      <BlockOutlined />
                                    </Tooltip>
                                  )}
                                </TableCell>
                                <TableCell align='right'>
                                  <Tooltip title='Edit score'>
                                    <IconButton
                                      onClick={() => {
                                        setSelectedSubmission(submission)
                                        openEditScore()
                                      }}
                                      color='primary'
                                    >
                                      <EditRounded fontSize='small' />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Stack>
                    )}
                  </Box>
                )}

                {assignmentSubmissions && assignmentSubmissions.content.length > 1 && (
                  <Pagination
                    page={page}
                    count={assignmentSubmissions?.totalPages}
                    onChange={(_, page) => setPage(page)}
                    sx={{ mt: 2 }}
                  />
                )}
                {selectedSubmission && isOpenEditScore && (
                  <ModalEditScore
                    isOpen={isOpenEditScore}
                    onClose={() => {
                      closeEditScore()
                      setSelectedSubmission(null)
                    }}
                    defaultValue={selectedSubmission.score || 0}
                    onSubmit={handleSubmitScore}
                  />
                )}
                {selectedSubmission?.textSubmission && isOpenTextReview && (
                  <ReviewSubmissionText
                    isOpen={isOpenTextReview}
                    content={selectedSubmission.textSubmission}
                    noEdit
                    onClose={handleCloseReview}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <AssignmentStatistic data={assignmentSubmissions?.content} />
        </Grid>
      </Grid>
    </Stack>
  )
}
