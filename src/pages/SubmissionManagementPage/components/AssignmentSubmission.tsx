import { Loading, NoData } from '@/components'
import { useBoolean } from '@/hooks'
import { ReviewSubmissionText } from '@/pages/AssignmentPage/components'
import { Submission } from '@/services/assignmentSubmission/assignmentSubmission.dto'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { downloadFileByLink, formatDate } from '@/utils'
import { BarChart, BlockOutlined, Edit, FileDownloadOutlined, VisibilityOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ModalEditScore, ModalUnsubmit } from '.'
import { assignmentSubmissionService } from '@/services/assignmentSubmission/assignmentSubmission.service'
import { toast } from 'react-toastify'
import { userKeys } from '@/services/user/user.query'
import { ModalAssignmentStatistic } from './ModalAssignmentStatistic'

type AssignmentSubmissionProps = {
  courseId: number
  assignmentId: number
}

const DEFAULT_PAGE_LIMIT = 1
export const AssignmentSubmission = ({ courseId, assignmentId }: AssignmentSubmissionProps) => {
  const [page, setPage] = useState(1)

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const { value: isOpenEditScore, setTrue: openEditScore, setFalse: closeEditScore } = useBoolean(false)
  const { value: isOpenTextReview, setTrue: openTextReview, setFalse: closeTextReview } = useBoolean(false)
  const { value: isOpenUnsubmit, setTrue: openUnsubmit, setFalse: closeUnsubmit } = useBoolean(false)
  const { value: isOpenViewStatistic, setTrue: openViewStatistic, setFalse: closeViewStatistic } = useBoolean(false)

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
    refetch: refetchSubmission,
  } = useQuery({ ...assignmentSubmissionInstance })

  const studentsInstance = userKeys.list({ courseId: Number(courseId) })
  const { data: students } = useQuery({
    ...studentsInstance,
    enabled: Boolean(courseId && assignmentSubmissions),
    select: (data) => {
      return data.content.filter(
        (student) => !assignmentSubmissions?.content.find((item) => item.studentInfo.id === student.id),
      )
    },
  })

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

  const headings = ['Student', 'Date', 'File', 'Link', 'Text', 'Score', 'Action']

  return (
    <Stack justifyContent='space-between' height='100%'>
      {isLoadingAssignmentSubmission && (
        <Box display='flex' alignItems='center' height='100%'>
          <Loading />
        </Box>
      )}
      <Box>
        {students && students.length > 0 && (
          <ModalUnsubmit isOpen={isOpenUnsubmit} onClose={closeUnsubmit} data={students} />
        )}
        <Stack direction='row' justifyContent='space-between'>
          {students && students.length > 0 && <Button onClick={openUnsubmit}>View Unsubmitted students</Button>}
          {assignmentSubmissions && assignmentSubmissions.content.length > 0 && (
            <Button sx={{ display: 'flex', gap: 1 }} variant='outlined' onClick={openViewStatistic}>
              <BarChart />
              View Statistics
            </Button>
          )}
        </Stack>
        {(isFetchedAssignmentSubmission && !assignmentSubmissions?.content.length) ||
        !assignmentSubmissions?.content.length ? (
          <Box display='flex' alignItems='center' height='100%'>
            <NoData title='No data' />
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
                    <TableCell align='right'>{formatDate.toDateTime(new Date(submission.createDate))}</TableCell>
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
                      {submission.score || (
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
                        >
                          <Edit />
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
      <Pagination
        page={page}
        count={assignmentSubmissions?.totalPages}
        onChange={(_, page) => setPage(page)}
        sx={{ mt: 2 }}
      />
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
      {assignmentSubmissions && assignmentSubmissions.content.length > 0 && (
        <ModalAssignmentStatistic
          data={assignmentSubmissions?.content}
          isOpen={isOpenViewStatistic}
          onClose={closeViewStatistic}
        />
      )}
    </Stack>
  )
}
