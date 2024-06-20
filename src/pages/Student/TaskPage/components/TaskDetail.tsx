import { icons } from '@/assets/icons'
import { ConfirmPopup, CustomModal, Dropzone, Flex, IconContainer, Loading } from '@/components'
import { useAlert, useBoolean } from '@/hooks'
import { fileService } from '@/services/file/file.service'
import { GroupTask } from '@/services/groupTask/dto'
import { taskSubmissionService } from '@/services/taskSubmission'
import { GetListSubmissionResponse } from '@/services/taskSubmission/dto'
import { taskSubmissionKeys } from '@/services/taskSubmission/query'
import { gray, primary } from '@/styles/theme'
import { getAbsolutePathFile } from '@/utils'
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
interface ITaskDetailProps {
  isOpen: boolean
  onClose: () => void
  data: GroupTask
}

const getFileName = (url: string) => {
  const split = url.split('SUBMISSION_FILE/')
  return split[split.length - 1]
}

export const TaskDetail = ({ isOpen, onClose, data }: ITaskDetailProps) => {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean(false)

  const taskSubmissionInstance = taskSubmissionKeys.list({ groupTaskId: data.id })
  const {
    data: taskSubmission,
    refetch: refetchTaskSubmission,
    isFetched: isFetchedTaskSubmission,
    isFetching: isFetchingTaskSubmission,
  } = useQuery({
    ...taskSubmissionInstance,
    enabled: Boolean(data.id),
  })

  const { mutate: mutateSubmitTask } = useMutation({
    mutationFn: taskSubmissionService.submit,
    onSuccess: () => {
      refetchTaskSubmission()
      onClose()
      triggerAlert('Submit successfully!')
    },
    onError: () => {
      triggerAlert("Can't submit your answer, please try again!", 'error')
    },
  })

  const { mutate: mutateUploadFile } = useMutation({
    mutationFn: fileService.upload,
    onSuccess: (payload) => {
      mutateSubmitTask({ fileUrl: payload.data.filePath, groupTaskId: data.id })
    },
    onError: () => {
      triggerAlert("Can't Upload file, please try again!", 'error')
    },
  })

  const { mutate: mutateDeleteSubmission } = useMutation({
    mutationFn: taskSubmissionService.delete,
    onSuccess: () => {
      queryClient.setQueryData(taskSubmissionInstance.queryKey, (oldData: GetListSubmissionResponse['data']) => {
        return {
          ...oldData,
          content: oldData.content.filter((item: any) => item.id !== taskSubmission?.content[0].id),
        }
      })
      triggerAlert('Remove successfully!')
    },
    onError: () => {
      triggerAlert("Can't Remove answer, please try again!", 'error')
    },
  })

  const handleDownloadFile = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }

    if (taskSubmission?.content[0]) {
      const url = getAbsolutePathFile(taskSubmission?.content[0].fileUrl) || ''
      const a = document.createElement('a')
      a.href = url
      a.download = taskSubmission?.content[0].fileUrl
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleRemoveAnswer = () => {
    if (file) {
      setFile(null)
    }

    if (taskSubmission?.content[0]) {
      mutateDeleteSubmission(taskSubmission?.content[0].id)
    }

    closeConfirm()
  }

  const handleSave = () => {
    if (file) {
      mutateUploadFile({ file: file as any, type: 'SUBMISSION_FILE' })
    }
  }

  console.log('taskSubmission?.content[0]', taskSubmission?.content[0])

  return (
    <>
      <CustomModal title='Task details' isOpen={isOpen} sx={{ maxWidth: 800 }} onClose={onClose}>
        <Divider sx={{ my: 2 }} />
        <Flex justifyContent='space-between'>
          <Flex gap={1}>
            <Box width={20} height={20}>
              {icons['task']}
            </Box>
            <Typography fontWeight={700} variant='body2'>
              {data.taskInfo.name}
            </Typography>
          </Flex>
        </Flex>
        <Stack gap={2}>
          <Stack gap={1} mt={2}>
            <Flex gap={2}>
              {icons['calendar']}
              <Typography variant='body2' fontWeight={700}>
                12/12/2021 11:59 PM
              </Typography>
            </Flex>
            <Flex gap={2}>
              {icons['deadline']}
              <Typography variant='body2' fontWeight={700}>
                12/22/2021 11:59 PM
              </Typography>
            </Flex>
          </Stack>
        </Stack>
        <Stack gap={0.5} mt={2}>
          <Typography variant='body2'>{data.taskInfo.description}</Typography>
        </Stack>
        <Stack mt={2} gap={1}>
          <Flex gap={1}>
            {icons['resource']}
            <Typography variant='body2' fontWeight={700}>
              {file ? 'Your answer' : 'Upload your answer'}
            </Typography>
          </Flex>
          {isFetchingTaskSubmission && (
            <Flex width='100%' py={4}>
              <Loading />
            </Flex>
          )}
          {isFetchedTaskSubmission && !file && !taskSubmission?.content[0] && <Dropzone onFileChange={setFile} />}
          {(file || taskSubmission?.content[0]) && (
            <Stack gap={2}>
              <Box
                border={1}
                borderRadius={3}
                borderColor={'#ededed'}
                px={2}
                py={2}
                sx={{ cursor: 'pointer' }}
                onClick={handleDownloadFile}
              >
                <Flex gap={1}>
                  <IconContainer isActive color='primary'>
                    {icons['resource']}
                  </IconContainer>
                  <Stack>
                    <Typography variant='body2' fontWeight={700}>
                      {file?.name || getFileName(taskSubmission?.content[0].fileUrl || '')}
                    </Typography>
                    {file && (
                      <Typography variant='body2' color={gray[400]}>
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    )}
                  </Stack>
                  <Chip
                    label='Remove'
                    onClick={(e) => {
                      e.stopPropagation()
                      openConfirm()
                    }}
                    sx={{ ml: 'auto', bgcolor: primary[500], color: primary[50] }}
                  />
                </Flex>
              </Box>
            </Stack>
          )}
          <Flex justifyContent='end' mt={2} gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant='contained' onClick={handleSave}>
              Save
            </Button>
          </Flex>
        </Stack>
      </CustomModal>
      <ConfirmPopup
        isOpen={isOpenConfirm}
        onClose={closeConfirm}
        onAccept={handleRemoveAnswer}
        title='Remove Answer'
        type='delete'
        subtitle='Are you sure to remove your answer, everyone in group will be notified about this!'
      />
    </>
  )
}
