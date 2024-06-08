import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, Box, IconButton, ListItemIcon, MenuItem, Stack, Typography } from '@mui/material'
import { CopyAllRounded, DeleteRounded, MoreHorizRounded } from '@mui/icons-material'
import { useAlert, useAuth, useBoolean, useMenu, useOnClickOutside } from '@/hooks'
import { useEffect, useRef, useState } from 'react'
import { yellow } from '@mui/material/colors'
import { BoxCreateComment } from '.'
import { commentService } from '@/services'
import { groupCommentKeys } from '@/services/groupComment/query'
import { GroupComment } from '@/services/groupComment/types'
import { gray, primary } from '@/styles/theme'
import { ConfirmPopup, CustomMenu, Flex } from '@/components'
import { Comment } from '@/services/comment/types'

interface IBoxCommentProps {
  data: GroupComment
}

export const BoxComment = ({ data }: IBoxCommentProps) => {
  const { triggerAlert } = useAlert()
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const commentRef = useRef<HTMLDivElement>(null)
  const [selectedComment, setSelectedComment] = useState<Comment>()
  const { value: isOpenCreateAnswer, setTrue: openCreateAnswer, setFalse: closeCreateAnswer } = useBoolean()
  const { value: isOpenConfirmDelete, setTrue: openConfirmDelete, setFalse: closeConfirmDelete } = useBoolean()
  const {
    anchorEl: anchorElActions,
    isOpen: isOpenMenuActions,
    onClose: closeMenuActions,
    onOpen: openMenuActions,
  } = useMenu()

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

  const { mutate: mutateDelete } = useMutation({
    mutationFn: commentService.delete,
    onSuccess: () => {
      closeConfirmDelete()
      closeMenuActions()
      queryClient.invalidateQueries({ queryKey: groupCommentKeys.lists() })
      triggerAlert('Delete comment successfully')
    },
  })

  const handleDeleteComment = () => {
    selectedComment && mutateDelete(selectedComment.id)
  }

  const menuItems = {
    copyLink: {
      text: 'Copy link to this discussion',
      icon: <CopyAllRounded fontSize='small' />,
      onClick: () => {
        closeMenuActions()
        navigator.clipboard.writeText(window.location.href)
        triggerAlert('Copied link to clipboard')
      },
    },
    ...((selectedComment?.studentInfo || selectedComment?.teacherInfo)?.id === profile?.data.id && {
      remove: {
        text: 'Remove',
        icon: <DeleteRounded fontSize='small' color='error' />,
        onClick: () => {
          closeMenuActions()
          openConfirmDelete()
        },
      },
    }),
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
        element.style.backgroundColor = primary[400]

        // add transition effect when hover
        element.style.transition = 'all ease-in 0.1s'
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
  }, [commentRef.current])

  return (
    data.commentInfo.length > 0 && (
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
        onClick={(e) => {
          e.stopPropagation()
          openCreateAnswer()
        }}
      >
        {data.commentInfo.map((comment, index) => (
          <Stack gap={1} key={comment.id}>
            <Flex gap={1} position='relative'>
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
                <Avatar
                  sx={{ width: 20, height: 20 }}
                  src={comment.studentInfo?.avatarPath || comment.teacherInfo?.avatarPath}
                >
                  {(comment.studentInfo?.fullName || comment.teacherInfo?.fullName || '').charAt(0)}
                </Avatar>
              </Box>
              <Typography variant='body2' fontWeight={500}>
                {comment.studentInfo?.fullName || comment.teacherInfo?.fullName}
              </Typography>
              <Typography variant='caption' color='#ccc'>
                1m
              </Typography>

              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  openMenuActions(e)
                  setSelectedComment(comment)
                }}
                sx={{ position: 'absolute', right: 0 }}
              >
                <MoreHorizRounded fontSize='small' />
              </IconButton>
            </Flex>
            <Box ml={4}>
              <Typography variant='body2' color='#000'>
                {comment.content}
              </Typography>
            </Box>
          </Stack>
        ))}

        <CustomMenu anchorEl={anchorElActions} onClose={closeMenuActions} open={isOpenMenuActions}>
          {Object.entries(menuItems).map(([key, item]) => (
            <MenuItem
              key={key}
              onClick={() => {
                item.onClick()
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Typography variant='body2'>{item.text}</Typography>
            </MenuItem>
          ))}
        </CustomMenu>
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
        <ConfirmPopup
          subtitle='Would you like to delete this comment'
          isOpen={isOpenConfirmDelete}
          onAccept={handleDeleteComment}
          onClose={closeConfirmDelete}
          type='delete'
        />
      </Stack>
    )
  )
}
