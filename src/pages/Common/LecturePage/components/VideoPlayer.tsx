import { Flex } from '@/components'
import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useRef, useEffect } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
interface IVideoPlayerProps {
  options: {
    autoplay: boolean
    controls: boolean
    responsive: boolean
    fluid: boolean
    sources: {
      src: string | undefined
      type: string
    }[]
  }
}

export const VideoPlayer = (props: IVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any | null>(null)
  const { options } = props

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      playerRef.current = videojs(videoElement, { ...options, controls: true }, () => {
        videojs.log('player is ready')
      })
    } else if (playerRef.current) {
      const player = playerRef.current
      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [])

  return (
    <Flex
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: grey[900],
        '&:hover .hover-overlay': {
          opacity: 1,
        },
      }}
      width='100%'
      height={600}
      alignItems='center'
      justifyContent='center'
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: 600,
        }}
        data-vjs-player
      >
        <Box
          ref={videoRef}
          className='video-js vjs-default-skin'
          sx={{ height: '100%', width: 'auto', aspectRatio: 16 / 9 }}
        />
      </Box>
    </Flex>
  )
}
