import { icons } from '@/assets/icons'
import { Flex, Loading, NoData, PDFViewer } from '@/components'
import { configs } from '@/configs'
import { useAlert } from '@/hooks'
import { resourceKey } from '@/services/resource/query'
import { resourceService } from '@/services/resource/resource.service'
import { ArrowBackRounded } from '@mui/icons-material'
import { Button, Card, CardContent, Container, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import videojs from 'video.js'
import { getAbsolutePathFile } from '@/utils'

const trackingUrl = (url: string) => {
  return `${configs.API_URL}/api/file/download${url}`
}

export function ResourcePage() {
  const { triggerAlert } = useAlert()
  const { resourceId, unitId, courseId } = useParams()

  const resourceInstance = resourceKey.detail(Number(resourceId))
  const {
    data: resource,
    isFetched: isFetchedResource,
    isLoading: isLoadingResource,
  } = useQuery({ ...resourceInstance })

  const { mutate: mutateTrackingResource } = useMutation({
    mutationFn: resourceService.createTracking,
    onSuccess: () => {
      triggerAlert('You have reached the last page of the document')
    },
  })

  const handleLastPage = () => {
    if (!resource?.resourceTrackingInfo) {
      mutateTrackingResource({ resourceId: Number(resourceId), unitId: Number(unitId), courseId: Number(courseId) })
    }
  }

  const handleBackPage = () => {
    window.history.back()
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

  if (isLoadingResource)
    return (
      <Flex height='80vh'>
        <Loading />
      </Flex>
    )

  return (
    isFetchedResource &&
    (resource ? (
      <Container maxWidth='lg'>
        <Button startIcon={<ArrowBackRounded />} color='secondary' sx={{ mb: 2 }} onClick={handleBackPage}>
          Back
        </Button>

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
          <>
            {resource.state === 'PROCESSING' && <Typography>Video Processing...</Typography>}
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} title={resource.title} />
          </>
        )}
      </Container>
    ) : (
      <NoData title='No Resource Found' />
    ))
  )
}
