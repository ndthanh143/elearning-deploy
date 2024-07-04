import { useParams } from 'react-router-dom'
import { lectureKeys } from '../../../services/lecture/lecture.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Container, IconButton, Stack, Typography } from '@mui/material'
import { CustomTooltip, DangerouseLyRenderLecture, Flex, NotFound } from '../../../components'
import { CommentRounded } from '@mui/icons-material'
import { useAuth, useBoolean, useIntersectionObserver } from '@/hooks'
import { useEffect, useRef, useState } from 'react'
import { lectureService } from '@/services/lecture/lecture.service'
import { BoxComment, BoxCreateComment } from './components'
import { RoleEnum } from '@/services/auth/auth.dto'
import { courseKeys } from '@/services/course/course.query'
import { commentService } from '@/services'
import { groupCommentKeys } from '@/services/groupComment/query'
import { primary } from '@/styles/theme'
import { unitService } from '@/services/unit'

export const LecturePage = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const { value: isOpenCreateComment, setTrue: openCreateComment, setFalse: closeCreateComment } = useBoolean()
  const { lectureId, courseId, unitId } = useParams()
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number; element: HTMLElement | null }>({
    top: 0,
    left: 0,
    element: null,
  })
  const [showCommentButton, setShowCommentButton] = useState(false)

  const boxCreateCommentRef = useRef<HTMLDivElement>(null)
  const contentContainerRef = useRef<HTMLDivElement>(null)

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

  const { mutate: mutateTracking } = useMutation({
    mutationFn: unitService.tracking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.details() })
    },
  })

  const handleUpdateLecture = (blockId: string) => {
    const originalHTML = (buttonPosition.element as any).innerHTML
    const newHTML = `<span id="${blockId}">${originalHTML}</span>`
    const updateContent = lectureData?.lectureContent.replace(originalHTML, newHTML)
    mutateUpdateLecture({
      id: Number(lectureId),
      lectureContent: updateContent,
    })
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
    const targetComponent = contentContainerRef.current
    const elements = targetComponent?.childNodes || []

    const mouseOverHandler = (e: any) => {
      const target = e.target as HTMLElement

      const rect = target?.getBoundingClientRect()
      setButtonPosition({ top: rect.top + 2, left: rect.left - 30, element: target }) // Position button to the left of the element
      setShowCommentButton(true)
    }

    elements.forEach((element) => {
      element.addEventListener('mouseover', mouseOverHandler)
    })

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('mouseover', mouseOverHandler)
      })
    }
  }, [contentContainerRef.current])

  const handleClickCreateComment = () => {
    openCreateComment()

    const e = buttonPosition.element
    if (e) {
      // add transition effect
      e.style.transition = 'all ease-in 0.1s'
      e.style.borderBottom = '2px solid'
      e.style.borderColor = primary[600]
    }
  }

  useEffect(() => {
    if (isOpenCreateComment && boxCreateCommentRef.current) {
      boxCreateCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [boxCreateCommentRef.current])

  useEffect(() => {
    if (isIntersecting && profile?.data.role === RoleEnum.Student) {
      mutateTracking({
        courseId: Number(courseId),
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
        <Container sx={{ py: 3 }}>
          <Flex gap={8} alignItems='start'>
            <Stack gap={2} flex={1}>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant='body1' fontWeight={500} sx={{ textDecoration: 'underline' }}>
                  {lectureData.lectureName}
                </Typography>
              </Stack>
              <Box bgcolor='white' p={2} borderRadius={3}>
                <DangerouseLyRenderLecture ref={contentContainerRef} content={lectureData.lectureContent} />
              </Box>
              {showCommentButton && (
                <CustomTooltip title='Comment'>
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
                    <CommentRounded fontSize='small' color='primary' />
                  </IconButton>
                </CustomTooltip>
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
