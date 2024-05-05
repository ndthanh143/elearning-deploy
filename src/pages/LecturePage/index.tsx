import { useNavigate, useParams } from 'react-router-dom'
import { lectureKeys } from '../../services/lecture/lecture.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, Box, Button, Container, IconButton, Slider, Stack, Tooltip, Typography } from '@mui/material'
import { DangerouseLyRenderLecture, Flex, NotFound } from '../../components'
import { ArrowBack, CommentOutlined } from '@mui/icons-material'
import { useAuth, useBoolean, useIntersectionObserver } from '@/hooks'
import { useEffect, useRef, useState } from 'react'
import { lectureService } from '@/services/lecture/lecture.service'
import { yellow } from '@mui/material/colors'
import { topicCommentService } from '@/services/topicComment/topicComment.service'
import { BoxCreateComment } from './components'
import { RoleEnum } from '@/services/auth/auth.dto'
import { unitKey } from '@/services/unit/query'
import { courseKeys } from '@/services/course/course.query'

const BoxComment = () => {
  return (
    <Stack
      p={2}
      my={1}
      border={1}
      borderColor='#ededed'
      borderRadius={2}
      gap={1}
      sx={{
        ':hover': {
          ml: -2,
        },
        transition: 'all ease-in 0.05s',
      }}
    >
      <Flex gap={1}>
        <Avatar sx={{ width: 20, height: 20 }}>A</Avatar>
        <Typography variant='body2' fontWeight={500}>
          Nguyen Duy Thanh
        </Typography>
        <Typography variant='caption' color='#ccc'>
          1m
        </Typography>
      </Flex>
      <Box ml={4}>
        <Typography variant='body2' color='#000'>
          Content goes here...
        </Typography>
      </Box>
    </Stack>
  )
}

export const LecturePage = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { lectureId, courseId, unitId } = useParams()
  const { value: isOpenCreateComment, setTrue: openCreateComment, setFalse: closeCreateComment } = useBoolean()
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, element: null })
  const [showCommentButton, setShowCommentButton] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { isIntersecting, ref: setTrackingRef } = useIntersectionObserver({
    threshold: 1.0,
    root: null,
    rootMargin: '0px',
    freezeOnceVisible: true,
  })

  const lectureInstance = lectureKeys.detail(Number(lectureId))
  const { data: lectureData, isFetched: isFetchedLecture } = useQuery({
    ...lectureInstance,
    enabled: Boolean(lectureId),
  })

  const goBack = () => navigate(`/courses/${courseId}`)

  const { mutate: mutateUpdateLecture } = useMutation({ mutationFn: lectureService.update })
  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: topicCommentService.create,
    onSuccess: (data) => {
      handleUpdateLecture()
    },
  })

  const { mutate: mutateCreateTracking } = useMutation({
    mutationFn: lectureService.createTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.details() })
    },
  })

  const handleUpdateLecture = () => {
    const originalHTML = (buttonPosition.element as any).target.innerHTML
    const newHTML = `<span id="abc">${originalHTML}</span>`
    const updateContent = lectureData?.lectureContent.replace(originalHTML, newHTML)
    if (updateContent) {
      mutateUpdateLecture({
        id: Number(lectureId),
        lectureContent: updateContent,
      })
    }
  }

  const handleCreateComment = (data: { content: string }) => {
    if (profile) {
      mutateCreateComment({
        topicId: Number(lectureId),
        content: data.content,
        accountId: profile.data.id,
      })
    }
  }

  useEffect(() => {
    const targetComponent = document.getElementById('content-container')
    const elements = targetComponent?.childNodes || []

    const mouseOverHandler = (e: any) => {
      const rect = e.target.getBoundingClientRect()
      setButtonPosition({ top: rect.top + 4, left: rect.left - 30, element: e }) // Position button to the left of the element
      setShowCommentButton(true)
    }

    const mouseOutHandler = (e: any) => {
      // e.target.style.borderBottom = 'none'
    }

    elements.forEach((element) => {
      element.addEventListener('mouseover', mouseOverHandler)
      element.addEventListener('mouseout', mouseOutHandler)
    })

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('mouseover', mouseOverHandler)
        element.removeEventListener('mouseout', mouseOutHandler)
      })
    }
  }, [])

  const handleClickCreateComment = () => {
    openCreateComment()
    const e = buttonPosition.element
    if (e) {
      e.target.style.borderBottom = '2px solid'
      e.target.style.borderColor = yellow[600]
    }
  }

  useEffect(() => {
    if (isIntersecting && profile?.data.roleInfo.name === RoleEnum.Student) {
      mutateCreateTracking({
        courseId: Number(courseId),
        lectureId: Number(lectureId),
        unitId: Number(unitId),
      })
    }
  }, [isIntersecting])

  if (!lectureData && isFetchedLecture) {
    return <NotFound />
  }

  return (
    lectureData && (
      <>
        <Container>
          <Flex gap={8}>
            <Box flex={1}>
              <Stack direction='row' justifyContent='space-between'>
                <Button sx={{ gap: 1 }} onClick={goBack} color='secondary'>
                  <ArrowBack fontSize='small' />
                  Back
                </Button>
                <Typography variant='h5' fontWeight={500} fontStyle='italic' sx={{ textDecoration: 'underline' }}>
                  {lectureData.lectureName}
                </Typography>
              </Stack>
              <DangerouseLyRenderLecture content={lectureData.lectureContent} />
              {showCommentButton && (
                <Tooltip title='Comment'>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: `${buttonPosition.top}px`,
                      left: `${buttonPosition.left}px`,
                      zIndex: 10,
                    }}
                    onClick={handleClickCreateComment}
                    size='small'
                  >
                    <CommentOutlined fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box width={300} height='100%'>
              <BoxComment />
              <BoxComment />
              {isOpenCreateComment && (
                <BoxCreateComment
                  onClose={() => {
                    closeCreateComment()
                    // buttonPosition.element?.target.style.borderBottom = 'none'
                  }}
                  onSubmit={handleCreateComment}
                />
              )}
            </Box>
          </Flex>
          <Box ref={setTrackingRef} sx={{ visibility: 'hidden' }} />
        </Container>
        <Slider
          value={scrollProgress}
          sx={{
            '.MuiSlider-thumb': {
              display: 'none',
            },
            py: 0,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      </>
    )
  )
}
