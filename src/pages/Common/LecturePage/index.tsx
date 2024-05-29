import { useNavigate, useParams } from 'react-router-dom'
import { lectureKeys } from '../../../services/lecture/lecture.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, Box, Button, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { DangerouseLyRenderLecture, Flex, NotFound } from '../../../components'
import { ArrowBack, CommentOutlined } from '@mui/icons-material'
import { useAuth, useBoolean, useIntersectionObserver, useOnClickOutside } from '@/hooks'
import { useEffect, useRef, useState } from 'react'
import { lectureService } from '@/services/lecture/lecture.service'
import { yellow } from '@mui/material/colors'
import { BoxCreateComment } from './components'
import { RoleEnum } from '@/services/auth/auth.dto'
import { courseKeys } from '@/services/course/course.query'
import { commentService } from '@/services'
import { groupCommentKeys } from '@/services/groupComment/query'
import { GroupComment } from '@/services/groupComment/types'
import { gray, primary } from '@/styles/theme'

interface IBoxCommentProps {
  data: GroupComment
}

const BoxComment = ({ data }: IBoxCommentProps) => {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const commentRef = useRef<HTMLDivElement>(null)
  const { value: isOpenCreateAnswer, setTrue: openCreateAnswer, setFalse: closeCreateAnswer } = useBoolean()
  useOnClickOutside(commentRef, closeCreateAnswer)

  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: commentService.create,
    onSuccess: () => {
      closeCreateAnswer()
      queryClient.invalidateQueries({ queryKey: groupCommentKeys.lists() })
    },
  })

  const handleCreateComment = (payload: { content: string }) => {
    mutateCreateComment({
      ...(data.lectureInfo && {
        lectureId: data.lectureInfo.id,
      }),
      content: payload.content,
      unitId: data.unitInfo.id,
      courseId: data.courseInfo.id,
      groupCommentId: data.id,
    })
  }

  useEffect(() => {
    const element = document.getElementById(data.blockId)
    if (element) {
      element.style.backgroundColor = isOpenCreateAnswer ? yellow[400] : 'transparent'

      if (isOpenCreateAnswer) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [isOpenCreateAnswer])

  useEffect(() => {
    const element = document.getElementById(data.blockId)

    if (element && commentRef.current) {
      const mouseOverHandler = () => {
        element.style.backgroundColor = yellow[400]
      }

      const mouseOutHandler = () => {
        element.style.backgroundColor = 'transparent'
      }

      commentRef.current.addEventListener('mouseover', mouseOverHandler)
      commentRef.current.addEventListener('mouseout', mouseOutHandler)

      return () => {
        commentRef.current?.removeEventListener('mouseover', mouseOverHandler)
        commentRef.current?.removeEventListener('mouseout', mouseOutHandler)
      }
    }
  }, [commentRef])

  return (
    <Stack
      gap={2}
      ref={commentRef}
      sx={{
        ':hover': {
          ml: -2,
        },
        transition: 'all ease-in 0.05s',
      }}
      p={2}
      my={1}
      border={1}
      borderColor='#e9e9e9'
      borderRadius={2}
      onClick={openCreateAnswer}
    >
      {data.commentInfo.map((comment, index) => (
        <>
          <Stack gap={1}>
            <Flex gap={1}>
              <Box position='relative'>
                {index > 0 && (
                  <Box
                    position='absolute'
                    height={30}
                    width={2}
                    bgcolor={gray[100]}
                    top='-100%'
                    left='50%'
                    sx={{ transform: 'translate(-50%, -16px)' }}
                  />
                )}

                <Avatar sx={{ width: 20, height: 20 }} src={comment.accountInfo.avatarPath}>
                  {comment.accountInfo.fullName.charAt(0)}
                </Avatar>
              </Box>
              <Typography variant='body2' fontWeight={500}>
                {comment.accountInfo.fullName}
              </Typography>
              <Typography variant='caption' color='#ccc'>
                1m
              </Typography>
            </Flex>
            <Box ml={4}>
              <Typography variant='body2' color='#000'>
                {comment.content}
              </Typography>
            </Box>
          </Stack>
        </>
      ))}
      {isOpenCreateAnswer && (
        <Flex width='100%' gap={1} alignItems='start'>
          <Avatar sx={{ width: 20, height: 20 }} src={profile?.data.avatarPath}>
            {profile?.data.fullName.charAt(0)}
          </Avatar>
          <Box flex={1}>
            <BoxCreateComment onClose={closeCreateAnswer} onSubmit={handleCreateComment} />
          </Box>
        </Flex>
      )}
    </Stack>
  )
}

export const LecturePage = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { value: isOpenCreateComment, setTrue: openCreateComment, setFalse: closeCreateComment } = useBoolean()
  const { lectureId, courseId, unitId } = useParams()
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number; element: HTMLElement | null }>({
    top: 0,
    left: 0,
    element: null,
  })
  const [showCommentButton, setShowCommentButton] = useState(false)

  const boxCreateCommentRef = useRef<HTMLDivElement>(null)

  const groupCommentInstance = groupCommentKeys.list({ courseId: Number(courseId), unitId: Number(unitId) })
  const { data: groupComments, refetch: refetchGroupComments } = useQuery({ ...groupCommentInstance })

  const { isIntersecting, ref: setTrackingRef } = useIntersectionObserver({
    threshold: 1.0,
    root: null,
    rootMargin: '0px',
    freezeOnceVisible: true,
  })

  const lectureInstance = lectureKeys.detail(Number(lectureId))
  const {
    data: lectureData,
    isFetched: isFetchedLecture,
    refetch: refetchLecture,
  } = useQuery({
    ...lectureInstance,
    enabled: Boolean(lectureId),
  })

  const goBack = () => navigate(`/courses/${courseId}`)

  const { mutate: mutateUpdateLecture } = useMutation({
    mutationFn: lectureService.update,
    onSuccess: () => {
      refetchLecture()
    },
  })
  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: commentService.create,
    onSuccess: (data) => {
      closeCreateComment()
      refetchGroupComments()
      handleUpdateLecture(data.data.groupCommentInfo.blockId)
    },
  })

  const { mutate: mutateCreateTracking } = useMutation({
    mutationFn: lectureService.createTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.details() })
    },
  })

  const handleUpdateLecture = (blockId: string) => {
    const originalHTML = (buttonPosition.element as any).target.innerHTML
    const newHTML = `<span id="${blockId}">${originalHTML}</span>`
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
        lectureId: Number(lectureId),
        content: data.content,
        unitId: Number(unitId),
        courseId: Number(courseId),
      })
    }
  }

  useEffect(() => {
    const targetComponent = document.getElementById('content-container')
    const elements = targetComponent?.childNodes || []

    const mouseOverHandler = (e: any) => {
      const target = e.target as HTMLElement

      const rect = target?.getBoundingClientRect()
      setButtonPosition({ top: rect.top + 4, left: rect.left - 30, element: target }) // Position button to the left of the element
      setShowCommentButton(true)
    }

    const mouseOutHandler = (e: any) => {
      e.target.style.borderBottom = 'none'
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
    if (boxCreateCommentRef.current) {
      boxCreateCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    const e = buttonPosition.element
    if (e) {
      e.style.borderBottom = '2px solid'
      e.style.borderColor = yellow[600]
    }
  }

  useEffect(() => {
    if (isIntersecting && profile?.data.role === RoleEnum.Student) {
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
          <Flex gap={8} alignItems='start'>
            <Stack gap={2} flex={1}>
              <Stack direction='row' justifyContent='space-between'>
                <Button sx={{ gap: 1 }} onClick={goBack} color='secondary'>
                  <ArrowBack fontSize='small' />
                  Back
                </Button>
                <Typography variant='body1' fontWeight={500} sx={{ textDecoration: 'underline' }}>
                  {lectureData.lectureName}
                </Typography>
              </Stack>
              <Box bgcolor='white' p={2} borderRadius={3}>
                <DangerouseLyRenderLecture content={lectureData.lectureContent} />
              </Box>
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
            </Stack>
            <Box width={300} height='100%'>
              {groupComments?.content.map((groupComment) => <BoxComment data={groupComment} key={groupComment.id} />)}
              {isOpenCreateComment && (
                <Box ref={boxCreateCommentRef}>
                  <BoxCreateComment
                    onClose={() => {
                      closeCreateComment()
                      // buttonPosition.element?.target.style.borderBottom = 'none'
                    }}
                    onSubmit={handleCreateComment}
                  />
                </Box>
              )}
            </Box>
          </Flex>
          <Box ref={setTrackingRef} sx={{ visibility: 'hidden' }} />
        </Container>
      </>
    )
  )
}
