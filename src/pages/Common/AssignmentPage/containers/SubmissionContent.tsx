import { ConfirmPopup, Show } from '@/components'
import { useAuth, useBoolean, useMenu } from '@/hooks'
import { AddOutlined, AttachFileOutlined, LinkOutlined, TextFormatOutlined } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  Chip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import {
  UploadPopup,
  TextPopup,
  LinkPopup,
  FileCard,
  ReviewSubmissionText,
  TextCard,
  ReviewSubmissionLink,
} from '../components'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UploadFileData } from '@/services/file/file.dto'
import { assignmentSubmissionService } from '@/services/assignmentSubmission/assignmentSubmission.service'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { Assignment } from '@/services/assignment/assignment.dto'
import { courseKeys } from '@/services/course/course.query'

export type SubmissionContentProps = {
  assignment: Assignment
  courseId: number
  unitId: number
}

export enum StatusSubmissionEnum {
  Expired = 'Expired',
  NotSubmit = 'Not Submit',
  Submitted = 'Submitted',
  Late = 'Lated',
}

const currentDate = dayjs()

export const SubmissionContent = ({ assignment, courseId, unitId }: SubmissionContentProps) => {
  const { profile } = useAuth()

  const queryClient = useQueryClient()

  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean()
  const { value: isOpenText, setTrue: openText, setFalse: closeText } = useBoolean()
  const { value: isOpenLink, setTrue: openLink, setFalse: closeLink } = useBoolean()
  const { value: isOpenReviewText, setTrue: openReviewText, setFalse: closeReviewText } = useBoolean()
  const { value: isOpenConfirmDelete, setTrue: openConfirmDelete, setFalse: closeConfirmDelete } = useBoolean()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const submissionInstance = assignmentSubmissionKeys.list({
    assignmentId: assignment.id,
    courseId,
    studentId: Number(profile?.data.id),
  })
  const { data: submissions, refetch: refetchSubmissions } = useQuery(submissionInstance)

  const { mutate: mutateSubmit } = useMutation({
    mutationFn: assignmentSubmissionService.create,
    onSuccess: () => {
      refetchSubmissions()
      toast.success('Upload successfully!')
      closeUpload()
      closeText()
      closeLink()
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
    },
  })

  const { mutate: mutateDeleteSubmit } = useMutation({
    mutationFn: assignmentSubmissionService.delete,
    onSuccess: () => {
      closeConfirmDelete()
      toast.success('Delete your submission successfully!')
      queryClient.setQueryData(submissionInstance.queryKey, null)
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
    },
  })

  const { mutate: mutateUpdateSubmit } = useMutation({
    mutationFn: assignmentSubmissionService.update,
    onSuccess: () => {
      toast.success('Update your submission successfully!')
      closeReviewText()
      queryClient.invalidateQueries({ queryKey: submissionInstance.queryKey })
    },
  })

  const handleSubmit = (values: UploadFileData) => {
    mutateSubmit({ assignmentId: assignment.id, fileSubmissionUrl: values.filePath, courseId, unitId })
  }

  const handleSubmitText = (values: string) => {
    mutateSubmit({ assignmentId: assignment.id, textSubmission: values, courseId, unitId })
  }

  const handleSubmitLink = (link: string) => {
    mutateSubmit({ assignmentId: assignment.id, linkSubmission: link, courseId, unitId })
  }

  const checkStatusSubmission =
    submissions &&
    (!submissions.content.length
      ? currentDate > dayjs(assignment.endDate)
        ? StatusSubmissionEnum.Expired
        : StatusSubmissionEnum.NotSubmit
      : dayjs(submissions.content[0].createDate) > dayjs(assignment.endDate)
        ? StatusSubmissionEnum.Late
        : StatusSubmissionEnum.Submitted)

  const handleClickItem = {
    file: () => {
      onClose()
      openUpload()
    },
    text: () => {
      onClose()
      openText()
    },
    link: () => {
      onClose()
      openLink()
    },
  }

  const handleDelete = () => {
    submissions && mutateDeleteSubmit(submissions.content[0].id)
  }

  const handleUpdateText = (values: string) => {
    mutateUpdateSubmit({ id: Number(submissions?.content[0].id), textSubmission: values })
  }

  return (
    <Card variant='outlined'>
      <CardContent>
        <Stack gap={2}>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h5'>Your submission</Typography>
            {checkStatusSubmission && (
              <Chip
                label={checkStatusSubmission}
                color={
                  [StatusSubmissionEnum.Expired, StatusSubmissionEnum.Late].includes(checkStatusSubmission)
                    ? 'error'
                    : 'success'
                }
              />
            )}
          </Stack>

          {submissions && submissions.content[0]?.fileSubmissionUrl && (
            <FileCard filePath={submissions.content[0]?.fileSubmissionUrl} onDelete={openConfirmDelete} />
          )}
          {submissions && submissions.content[0]?.textSubmission && (
            <TextCard onReview={openReviewText} onDelete={openConfirmDelete} />
          )}

          {submissions && submissions.content.length > 0 && (
            <>
              <Stack direction='row' alignItems='center' gap={1}>
                <Typography variant='body2' fontWeight={700}>
                  Your score:
                </Typography>
                <Typography variant='body2' fontWeight={700} color='success'>
                  {submissions?.content[0].score || '--'}
                </Typography>
              </Stack>
              <Stack gap={1}>
                <Typography variant='body2' fontWeight={700}>
                  Feedback from teacher:
                </Typography>
                <Typography sx={{ border: '1px solid #ededed', borderRadius: 3, p: 1 }}>
                  {submissions?.content[0].feedback || '--'}
                </Typography>
              </Stack>
            </>
          )}

          {submissions && submissions.content[0]?.textSubmission && (
            <ReviewSubmissionText
              content={submissions.content[0].textSubmission}
              isOpen={isOpenReviewText}
              onClose={closeReviewText}
              onUpdate={handleUpdateText}
            />
          )}
          {submissions && submissions.content[0]?.linkSubmission && (
            <ReviewSubmissionLink link={submissions.content[0]?.linkSubmission} onDelete={openConfirmDelete} />
          )}
          <Show when={!submissions?.content.length}>
            <Button fullWidth variant='outlined' onClick={onOpen}>
              <AddOutlined />
              <Typography>Thêm hoặc tạo</Typography>
            </Button>
          </Show>
        </Stack>
      </CardContent>

      <UploadPopup isOpen={isOpenUpload} onClose={closeUpload} onSubmit={handleSubmit} />
      <TextPopup isOpen={isOpenText} onClose={closeText} onSubmit={handleSubmitText} />
      <LinkPopup isOpen={isOpenLink} onClose={closeLink} onSubmit={handleSubmitLink} />
      <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
        <MenuItem onClick={handleClickItem.text}>
          <ListItemIcon>
            <TextFormatOutlined />
          </ListItemIcon>
          <ListItemText>Text</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClickItem.link}>
          <ListItemIcon>
            <LinkOutlined />
          </ListItemIcon>
          <ListItemText>Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClickItem.file}>
          <ListItemIcon>
            <AttachFileOutlined />
          </ListItemIcon>
          <ListItemText>File</ListItemText>
        </MenuItem>
      </Menu>
      <ConfirmPopup
        isOpen={isOpenConfirmDelete}
        onClose={closeConfirmDelete}
        onAccept={handleDelete}
        title='Confirm Delete submission'
        subtitle='Are you sure you want to delete this submission? This action cannot be undone.'
        type='delete'
      />
    </Card>
  )
}
