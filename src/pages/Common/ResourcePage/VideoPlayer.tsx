import { Flex } from '@/components'
import { Box, Typography, IconButton, Slider, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useRef, useEffect, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

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
  title: string
  onReady?: (player: any) => void
  onProgress?: () => void
}

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const VideoPlayer = (props: IVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any | null>(null)
  const { options, title, onReady, onProgress } = props
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, { ...options, controls: false }, () => {
        videojs.log('player is ready')
        setPlaying(!!player.autoplay())
        setDuration(player.duration() || 0)
        onReady && onReady(player)
      }))

      player.on('timeupdate', () => {
        const currentTime = player.currentTime() || 0
        setCurrentTime(currentTime)

        if (onProgress && !tracked && currentTime >= (player.duration() || 0 * 1) / 10) {
          onProgress()
          setTracked(true)
        }
      })

      player.on('durationchange', () => {
        setDuration(player.duration() || 0)
      })

      player.on('fullscreenchange', () => {
        setFullscreen(!!player.isFullscreen())
      })
    } else if (playerRef.current) {
      const player = playerRef.current
      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, onReady, onProgress])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [])

  const handlePlayPause = () => {
    const player = playerRef.current
    if (player) {
      if (player.paused()) {
        player.play()
        setPlaying(true)
      } else {
        player.pause()
        setPlaying(false)
      }
    }
  }

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const player = playerRef.current
    const newVolume = newValue as number
    setVolume(newVolume)
    if (player) {
      player.volume(newVolume)
    }
  }

  const handleMuteToggle = () => {
    const player = playerRef.current
    if (player) {
      setMuted(!muted)
      player.muted(!muted)
    }
  }

  const handleTimeChange = (_event: Event, newValue: number | number[]) => {
    const player = playerRef.current
    const newTime = newValue as number
    if (player) {
      player.currentTime(newTime)
    }
  }

  const handleToggleZoom = () => {
    const player = playerRef.current
    if (player) {
      if (fullscreen) {
        player.exitFullscreen()
      } else {
        player.requestFullscreen()
      }
    }
  }

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
      borderRadius={4}
      alignItems='center'
      justifyContent='center'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      <Stack
        className='hover-overlay'
        sx={{
          position: 'absolute',
          inset: 0,
          color: 'white',
          opacity: hovered || fullscreen ? 1 : 0,
          justifyContent: 'space-between',
          transition: 'opacity 0.3s ease-in-out',
          zIndex: fullscreen ? 1 : 'auto',
        }}
      >
        <Box px={4} pt={2}>
          <Typography variant='h6'>{title}</Typography>
        </Box>
        <Box px={4} pb={2}>
          <Slider
            value={currentTime}
            onChange={handleTimeChange}
            max={duration}
            step={1}
            sx={{ width: '100%', py: 1 }}
            color='primary'
          />
          <Stack direction='row' justifyContent='space-between' alignItems='center' gap={4}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <IconButton onClick={handlePlayPause} color='inherit' sx={{ padding: 0 }}>
                {playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton onClick={handleMuteToggle} color='inherit'>
                {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              <Box width={60}>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  step={0.1}
                  min={0}
                  max={1}
                  color='primary'
                  sx={{ py: 0.5 }}
                />
              </Box>
              <Typography variant='body2' whiteSpace='nowrap'>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Stack>
            <IconButton onClick={handleToggleZoom} color='inherit'>
              {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
