import { CustomSelect, Flex, Loading, NoData } from '@/components'
import { useAlert, useBoolean } from '@/hooks'
import { ReviewSubmissionText } from '@/pages/Common/AssignmentPage/components'
import { Submission } from '@/services/assignmentSubmission/assignmentSubmission.dto'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { downloadFileByLink, formatDate } from '@/utils'
import { BlockOutlined, EditRounded, FileDownloadOutlined, VisibilityOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { ModalEditScore, AssignmentStatistic, Filter } from '../components'
import { assignmentSubmissionService } from '@/services/assignmentSubmission/assignmentSubmission.service'
import { toast } from 'react-toastify'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { Course } from '@/services/course/course.dto'
import { icons } from '@/assets/icons'
import * as XLSX from 'xlsx'

const exportToExcel = ({
  data,
  sheetName = 'Sheet 1',
  fileName = 'download',
}: {
  data: Record<string, any>[]
  sheetName: string
  fileName: string
}) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Create a binary string representation of the workbook
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  // Create a Blob from the binary string
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })

  // Create a link element to trigger the download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const DEFAULT_PAGE_LIMIT = 5
export const AssignmentSubmission = ({ courses }: { courses: Course[] }) => {
  const { triggerAlert } = useAlert()
  const [page, setPage] = useState(1)

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const { value: isOpenEditScore, setTrue: openEditScore, setFalse: closeEditScore } = useBoolean(false)
  const { value: isOpenTextReview, setTrue: openTextReview, setFalse: closeTextReview } = useBoolean(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number>()
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>()

  const assignmentSubmissionInstance = assignmentSubmissionKeys.list({
    courseId: selectedCourseId,
    ...(selectedAssignmentId && { assignmentId: selectedAssignmentId }),
    page: page - 1,
    size: DEFAULT_PAGE_LIMIT,
  })

  const {
    data: assignmentSubmissions,
    isLoading: isLoadingAssignmentSubmission,
    isFetched: isFetchedAssignmentSubmission,
    refetch: refetchSubmission,
  } = useQuery({ ...assignmentSubmissionInstance })

  const assignmentsInstance = assignmentKeys.list({ courseId: selectedCourseId })
  const { data: assignments, refetch: refetchAssignments } = useQuery({
    ...assignmentsInstance,
    enabled: Boolean(selectedCourseId),
    select: (data) => data.content,
  })

  const handleCloseReview = () => {
    setSelectedSubmission(null)
    closeTextReview()
  }

  const { mutate: mutateUpdateScore } = useMutation({
    mutationFn: assignmentSubmissionService.update,
    onSuccess: () => {
      refetchSubmission()
      triggerAlert('Update score successfully', 'success')
      closeEditScore()
      setSelectedSubmission(null)
    },
  })

  const handleSubmitScore = (payload: { score: number; feedback?: string }) => {
    if (selectedSubmission) {
      mutateUpdateScore({ id: selectedSubmission.id, ...payload })
    }
  }

  const handleExportToExcel = () => {
    if (assignmentSubmissions?.content.length) {
      const data = assignmentSubmissions.content.map((submission) => ({
        Student: submission.studentInfo.fullName,
        Score: submission.score,
      }))
      exportToExcel({ data, sheetName: 'Assignment', fileName: 'Assignment' })
    } else {
      toast.error('No submissions to export')
    }
  }

  useEffect(() => {
    if (selectedCourseId) {
      refetchAssignments()
    }
  }, [selectedCourseId])

  const headings = ['Student', 'Submit date', 'File', 'Link', 'Text', 'Score', 'Action']

  return (
    <Stack gap={2}>
      <Flex justifyContent='space-between'>
        <Typography fontWeight={700}>Assignment</Typography>
        <Filter selectedCourses={selectedCourseId} courses={courses} onChangeCourse={setSelectedCourseId} />
      </Flex>
      <Stack gap={4}>
        <Card sx={{ height: '100%' }} elevation={0}>
          <CardContent sx={{ height: '100%' }}>
            <Flex mb={1} justifyContent='space-between'>
              <Typography variant='body2' fontWeight={700}>
                List submissions
              </Typography>
              <Flex gap={2}>
                <CustomSelect
                  data={[
                    { label: 'All', value: 'all' },
                    ...(assignments
                      ? assignments.map((item) => ({ label: item.assignmentTitle, value: item.id }))
                      : []),
                  ]}
                  value={selectedAssignmentId || 'all'}
                  size='small'
                  onChange={(e) => setSelectedAssignmentId(Number(e.target.value) ? Number(e.target.value) : undefined)}
                />

                <Button startIcon={icons['excel']} variant='outlined' onClick={handleExportToExcel}>
                  Export to Excel
                </Button>
              </Flex>
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
                                  <IconButton onClick={() => downloadFileByLink(String(submission.fileSubmissionUrl))}>
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
                                    <Link to={submission.linkSubmission} color='primary.main' target='_blank'>
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
                                  // <Chip color='primary' label={submission.score} />
                                  <Typography color={submission.score > 5 ? 'primary' : 'error'} fontWeight={700}>
                                    {submission.score}
                                  </Typography>
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
                  defaultFeedack={selectedSubmission.feedback}
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
        <AssignmentStatistic data={assignmentSubmissions?.content} />
      </Stack>
    </Stack>
  )
}
