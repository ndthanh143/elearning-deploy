import { icons } from '@/assets/icons'
import { CustomModal, Flex, IconContainer, NoData } from '@/components'
import { GroupTaskInfo } from '@/services/group/dto'
import { taskSubmissionKeys } from '@/services/taskSubmission/query'
import { getAbsolutePathFile, getFileName } from '@/utils'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

interface IModalGroupTaskDetailProps {
  isOpen: boolean
  onClose: () => void
  data: GroupTaskInfo
}

export function ModalGroupTaskDetail({ data, isOpen, onClose }: IModalGroupTaskDetailProps) {
  const groupTaskInstance = taskSubmissionKeys.list({ groupTaskId: data.id })
  const { data: submissions } = useQuery({ ...groupTaskInstance })

  const handleDownloadFile = () => {
    if (submissions?.content[0]) {
      const url = getAbsolutePathFile(submissions?.content[0].fileUrl) || ''
      const a = document.createElement('a')
      a.href = url
      a.download = submissions?.content[0].fileUrl
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title='Task details' maxWidth={500}>
      <Stack gap={1}>
        <Typography fontWeight={700}>{data.taskName}</Typography>
        <Typography>{data.description}</Typography>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack gap={1}>
        <Typography>Submission:</Typography>
        {submissions?.content[0] ? (
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
                    {getFileName(submissions?.content[0].fileUrl || '')}
                  </Typography>
                </Stack>
              </Flex>
            </Box>
          </Stack>
        ) : (
          <NoData title='No submission' />
        )}
      </Stack>
    </CustomModal>
  )
}
