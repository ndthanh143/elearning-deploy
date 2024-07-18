import { Flex } from '@/components'
import { Box, Typography, IconButton, Slider, Stack } from '@mui/material'
import { grey, red } from '@mui/material/colors'
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
  onTracking?: () => void
  duration?: number
}

export const VideoPlayer = (props: IVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any | null>(null)
  const { options, title, onReady, onTracking = () => {}, duration = 0 } = props
  const [_, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showIcon, setShowIcon] = useState(false)

  // const setTotalWatchTimeToStorage = (total: number) => {
  //   localStorage.setItem('totalWatchTime', JSON.stringify(total))
  // }

  // const getTotalWatchTimeFromStorage = () => {
  //   return Number(JSON.parse(localStorage.getItem('totalWatchTime') || '0'))
  // }

  const setTrackedToStorage = (tracked: boolean) => {
    localStorage.setItem('tracked', tracked ? 'true' : 'false')
  }

  const getTrackedFromStorage = () => {
    return localStorage.getItem('tracked') === 'true'
  }

  // useEffect(() => {
  //   setTrackedToStorage(false)
  //   localStorage.removeItem('totalWatchTime')
  // }, [])

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, { ...options, controls: false }, () => {
        videojs.log('player is ready')
        setPlaying(!!player.autoplay())
        onReady && onReady(player)
      }))

      player.on('timeupdate', () => {
        setCurrentTime(player.currentTime() || 0)

        const isTracked = getTrackedFromStorage()

        const currentTime = player.currentTime() || 0

        const isAvailable = !isTracked && currentTime >= (9.8 / 10) * duration

        if (isAvailable) {
          onTracking()
          setTrackedToStorage(true)
        }
      })
    } else if (playerRef.current) {
      const player = playerRef.current
      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, onReady])

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
      setFullscreen(!fullscreen)
    }
  }

  const handleClick = () => {
    handlePlayPause()
    setShowIcon(true)
    setTimeout(() => setShowIcon(false), 1000) // Show icon for 1 second
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
      alignItems='center'
      justifyContent='center'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick} // Handle click on the video screen
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
      {showIcon && (
        <Flex
          sx={{
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            bgcolor: 'rgba(0,0,0,0.4)',
            borderRadius: '100%',
            width: 100,
            height: 100,
            transform: 'translate(-50%, -50%)',
            animation: 'fade-in-out 1s ease-in-out', // Animation for the icon
          }}
        >
          {playing ? (
            <PauseIcon sx={{ fontSize: 60, color: 'white' }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: 60, color: 'white' }} />
          )}
        </Flex>
      )}
      <Stack
        className='hover-overlay'
        sx={{
          position: 'absolute',
          inset: 0,
          color: 'white',
          opacity: 0,
          justifyContent: 'space-between',
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <Box px={4} pt={2}>
          <Typography variant='h6'>{title}</Typography>
        </Box>
        <Stack px={4}>
          <Slider
            value={currentTime}
            min={0}
            max={duration}
            step={1}
            onChange={handleTimeChange}
            sx={{
              width: '100%',
              color: 'white',
              '& .MuiSlider-thumb': {
                display: 'none', // Hides the track
              },
              '& .MuiSlider-track': {
                height: 2,
                bgcolor: red[500],
                borderColor: red[500],
              },
              '& .MuiSlider-rail': {
                height: 2,
              },
            }}
          />
          <Flex justifyContent='space-between'>
            <Flex
              justifyContent='start'
              alignItems='center'
              sx={{
                ':hover': {
                  '.volume-slider': {
                    width: '100px',
                    visibility: 'visible',
                  },
                },
              }}
            >
              <IconButton onClick={handlePlayPause} size='small' sx={{ ml: -1.5 }}>
                {playing ? <PauseIcon sx={{ color: 'white' }} /> : <PlayArrowIcon sx={{ color: 'white' }} />}
              </IconButton>
              <IconButton onClick={handleMuteToggle}>
                {muted ? <VolumeOffIcon sx={{ color: 'white' }} /> : <VolumeUpIcon sx={{ color: 'white' }} />}
              </IconButton>
              <Slider
                className='volume-slider'
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  visibility: 'hidden',
                  width: 0,
                  color: 'white',
                  ml: 2,
                  '& .MuiSlider-thumb': {
                    height: 10,
                    width: 10,
                  },
                  '& .MuiSlider-track': {
                    height: 2,
                  },
                  '& .MuiSlider-rail': {
                    height: 2,
                  },
                }}
              />
            </Flex>
            <IconButton onClick={handleToggleZoom} sx={{ mr: -1 }} size='small'>
              {fullscreen ? <FullscreenExitIcon sx={{ color: 'white' }} /> : <FullscreenIcon sx={{ color: 'white' }} />}
            </IconButton>
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default VideoPlayer
