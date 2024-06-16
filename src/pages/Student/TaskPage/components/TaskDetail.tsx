import { icons } from '@/assets/icons'
import { ConfirmPopup, CustomModal, Dropzone, Flex, IconContainer } from '@/components'
import { useAlert, useBoolean } from '@/hooks'
import { fileService } from '@/services/file/file.service'
import { GroupTask } from '@/services/groupTask/dto'
import { taskSubmissionService } from '@/services/taskSubmission'
import { gray, primary } from '@/styles/theme'
import { Avatar, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
interface ITaskDetailProps {
  isOpen: boolean
  onClose: () => void
  data: GroupTask
}

export const TaskDetail = ({ isOpen, onClose, data }: ITaskDetailProps) => {
  const { triggerAlert } = useAlert()
  const [file, setFile] = useState<File | null>(null)
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean(false)

  const { mutate: mutateSubmitTask } = useMutation({
    mutationFn: taskSubmissionService.submit,
    onSuccess: () => {
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

  const handleDownloadFile = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleRemoveAnswer = () => {
    setFile(null)
    closeConfirm()
  }

  const handleSave = () => {
    if (file) {
      mutateUploadFile({ file: file as any, type: 'SUBMISSION_FILE' })
    }
  }

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
          {!file && <Dropzone onFileChange={setFile} />}
          {file && (
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
                      {file.name}
                    </Typography>
                    <Typography variant='body2' color={gray[400]}>
                      {(file.size / 1024).toFixed(1)} KB
                    </Typography>
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
              <Typography variant='body2' fontWeight={700}>
                Uploader
              </Typography>
              <Flex gap={1}>
                <Avatar src='https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTbyNyLxq6CsGjR7nhyJs0oRhnTSW0SUNYWnMnC-JSExpKha0bac6xzTufwCzAoqLed4J0zztdsnd0wy6U'>
                  R
                </Avatar>
                <Stack>
                  <Typography fontWeight={700} variant='body2'>
                    Cristiano Ronaldo
                  </Typography>
                  <Typography variant='body2' color={gray[400]}>
                    ronaldo.cristiano@gmail.com
                  </Typography>
                </Stack>
              </Flex>
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
