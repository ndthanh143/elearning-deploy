import { icons } from '@/assets/icons'
import { Flex, Loading, NoData, PDFViewer } from '@/components'
import { configs } from '@/configs'
import { resourceKey } from '@/services/resource/query'
import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { VideoPlayer } from './VideoPlayer'
import videojs from 'video.js'
import { formatDate, getAbsolutePathFile } from '@/utils'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { courseKeys } from '@/services/course/course.query'
import { useAlert } from '@/hooks'

const trackingUrl = (url: string) => {
  return `${configs.API_URL}/api/file/download${url}`
}

export function ResourcePage() {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const { resourceId, unitId, courseId } = useParams()

  const resourceInstance = resourceKey.detail({
    resourceId: Number(resourceId),
    unitId: Number(unitId),
    courseId: Number(courseId),
  })
  const {
    data: resource,
    isFetched: isFetchedResource,
    isLoading: isLoadingResource,
  } = useQuery({ ...resourceInstance })

  const { mutate: mutateTracking } = useMutation({
    mutationFn: unitService.tracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKey.all })
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
      triggerAlert('Tracked! Now you can move to next lesson !')
    },
  })

  const handleLastPage = () => {
    mutateTracking({ unitId: Number(unitId), courseId: Number(courseId) })
  }

  const videoSrc = resource?.state === 'DONE' ? resource?.urlDocument : getAbsolutePathFile(resource?.urlDocument || '')

  const playerRef = useRef(null)

  const videoJsOptions = {
    autoplay: false,
    controls: false,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoSrc,
        type: 'application/x-mpegURL',
      },
    ],
  }

  const handlePlayerReady = (player: any) => {
    playerRef.current = player

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }

  const handleTracking = () => {
    mutateTracking({ unitId: Number(unitId), courseId: Number(courseId) })
    // triggerAlert('tracking')
  }

  if (isLoadingResource)
    return (
      <Flex height='80vh'>
        <Loading />
      </Flex>
    )

  return (
    isFetchedResource &&
    (resource ? (
      <Box>
        {resource.urlDocument.includes('.pdf') && (
          <Card elevation={0}>
            <CardContent>
              <Flex mb={2} gap={1}>
                {icons['resource']}
                <Typography fontWeight={700}>{resource.title}</Typography>
              </Flex>
              <PDFViewer url={trackingUrl(resource.urlDocument)} onLastPage={handleLastPage} />
            </CardContent>
          </Card>
        )}
        {resource.urlDocument.includes('VIDEO') && (
          <Stack gap={4}>
            {/* {resource.state === 'PROCESSING' && <Typography>Video Processing...</Typography>} */}
            <VideoPlayer
              options={videoJsOptions}
              onReady={handlePlayerReady}
              title={resource.title}
              onTracking={handleTracking}
              duration={resource.duration}
            />
            <Container maxWidth='lg'>
              <Typography variant='h2' fontWeight={700}>
                {resource.title}
              </Typography>
              <Typography variant='body2' color='#333'>
                Last updated on {formatDate.toText(new Date())}
              </Typography>
            </Container>
          </Stack>
        )}
      </Box>
    ) : (
      <NoData title='No Resource Found' />
    ))
  )
}
