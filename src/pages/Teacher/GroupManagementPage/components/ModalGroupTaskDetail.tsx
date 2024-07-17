import { icons } from '@/assets/icons'
import { CustomModal, Flex, IconContainer, NoData } from '@/components'
import { useAlert } from '@/hooks'
import { GroupTaskInfo } from '@/services/group/dto'
import { groupKeys } from '@/services/group/query'
import { taskSubmissionService } from '@/services/taskSubmission'
import { taskSubmissionKeys } from '@/services/taskSubmission/query'
import { getAbsolutePathFile, getFileName } from '@/utils'
import { Box, Divider, Stack, Typography, Slider, Button, Skeleton, TextField } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface IModalGroupTaskDetailProps {
  isOpen: boolean
  onClose: () => void
  data: GroupTaskInfo
}

export function ModalGroupTaskDetail({ data, isOpen, onClose }: IModalGroupTaskDetailProps) {
  const { triggerAlert } = useAlert()
  const groupTaskInstance = taskSubmissionKeys.list({ groupTaskId: data.id })
  const { data: submissions, refetch, isLoading } = useQuery({ ...groupTaskInstance, enabled: isOpen })

  const queryClient = useQueryClient()
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

  const { mutate: mutateMarkScore } = useMutation({
    mutationFn: taskSubmissionService.markScore,
    onSuccess: () => {
      refetch()
      triggerAlert('Mark score successfully')
      onClose()
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
    onError: () => {
      triggerAlert('Mark score failed')
    },
  })

  const [score, setScore] = useState<number>(submissions?.content[0]?.score || 0)
  const [feedback, setFeedback] = useState<string>(submissions?.content?.[0]?.feedback || '')

  const handleScoreChange = (_: Event, newValue: number | number[]) => {
    const newScore = newValue as number
    setScore(newScore)
  }

  const handleMarkscore = () => {
    mutateMarkScore({ taskSubmissionId: submissions?.content[0].id || 0, score, feedback })
  }

  useEffect(() => {
    if (submissions && isOpen) {
      setScore(submissions?.content[0]?.score || 0)
      setFeedback(submissions?.content?.[0]?.feedback || '')
    }
  }, [submissions, isOpen])

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title='Task details'
      maxWidth={500}
      maxHeight='90vh'
      overflow='scroll'
    >
      <Stack gap={1}>
        <Typography fontWeight={700}>{data.taskName}</Typography>
        <Typography>{data.description}</Typography>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack gap={1}>
        <Typography variant='body2' fontWeight={700}>
          Submission:
        </Typography>
        {isLoading ? (
          <Skeleton variant='rectangular' width='100%' height={70} sx={{ borderRadius: 3 }} />
        ) : submissions?.content[0] ? (
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

        <Typography variant='body2' fontWeight={700}>
          Teacher score:
        </Typography>
        <Stack border={1} borderColor={'#ededed'} borderRadius={3} p={2} mb={2}>
          <Typography variant='body2' fontWeight={700}>
            Score: <b>{submissions?.content[0]?.score}</b>
          </Typography>
          <Box mx={1} mt={1}>
            <Slider
              value={score}
              onChange={handleScoreChange}
              aria-labelledby='score-slider'
              step={0.25}
              defaultValue={submissions?.content[0]?.score}
              marks
              min={0}
              max={10}
              valueLabelDisplay='auto'
              sx={{ mb: 2 }}
            />
          </Box>
          <Stack mb={2} gap={1}>
            <Typography variant='body2' fontWeight={700}>
              Feedback:
            </Typography>
            <TextField
              multiline
              minRows={4}
              maxRows={5}
              placeholder='Feedback...'
              value={feedback}
              defaultValue={submissions?.content[0]?.feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Stack>
        </Stack>
        <Button onClick={handleMarkscore} variant='contained'>
          Save Score
        </Button>
      </Stack>
    </CustomModal>
  )
}
