import { Alert, Button, Stack, Typography } from '@mui/material'
import { ArrowForwardRounded } from '@mui/icons-material'
import { Version, VERSION_STATE } from '@/services/course/course.dto'
import { gray } from '@/styles/theme'
import { useMutation } from '@tanstack/react-query'
import { versionService } from '@/services'
import { useAlert } from '@/hooks'

interface IPublishmentProps {
  version?: Version
}
export function Publishment({ version }: IPublishmentProps) {
  const { triggerAlert } = useAlert()
  const isPublished = version?.state === VERSION_STATE.approved
  const isRejected = version?.state === VERSION_STATE.rejected
  const isPending = version?.state === VERSION_STATE.pending
  const isInit = version?.state === VERSION_STATE.init

  const { mutate: mutateRequest } = useMutation({
    mutationFn: versionService.requestPublish,
    onSuccess: () => {
      triggerAlert('Your request have been sent, please wait for administrator to handle your request', 'success')
    },
  })

  const handleRequestPublish = () => {
    version && mutateRequest({ versionId: version?.id })
  }

  return (
    <Stack gap={1}>
      <Typography variant='h3' fontWeight={700}>
        Publishment
      </Typography>
      {isPublished && <Alert severity={'success'}>Your course have been published</Alert>}
      {isPending && <Alert severity={'info'}>Your course is pending for approval!</Alert>}
      {isRejected && (
        <>
          <Alert severity={'error'}>Your course have been rejected</Alert>
          <Typography>Cause by:</Typography>
          <Typography variant='body2' bgcolor={gray[200]} px={2} py={1}>
            {version?.note}
          </Typography>
        </>
      )}
      {isInit && (
        <>
          <Alert severity={'warning'}>Your course is not published yet</Alert>
          <Button endIcon={<ArrowForwardRounded />} variant='outlined' onClick={handleRequestPublish}>
            Request to be published
          </Button>
        </>
      )}
      {!version && <Alert severity={'info'}>Please create your course to publish to community</Alert>}
    </Stack>
  )
}
