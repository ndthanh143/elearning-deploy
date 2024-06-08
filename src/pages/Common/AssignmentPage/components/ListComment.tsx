import { ConfirmPopup, ContentEditable, CustomMenu, Flex } from '@/components'
import { useAlert, useAuth, useBoolean, useMenu } from '@/hooks'
import { commentService } from '@/services'
import { Comment } from '@/services/comment/types'
import { groupCommentKeys } from '@/services/groupComment/query'
import { formatDate } from '@/utils'
import { CopyAllRounded, DeleteRounded, MoreHorizRounded, PeopleAltRounded } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export function ListComment({
  courseId,
  unitId,
  assignmentId,
}: {
  courseId: string
  unitId: string
  assignmentId: string
}) {
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const { triggerAlert } = useAlert()
  const { value: isOpenComment, setTrue: openComment, setFalse: closeComment } = useBoolean(false)
  const { value: isOpenConfirmDelete, setTrue: openConfirmDelete, setFalse: closeConfirmDelete } = useBoolean()
  const [comment, setComment] = useState('')
  const [selectedComment, setSelectedComment] = useState<Comment>()

  const groupCommentInstance = groupCommentKeys.list({ courseId: Number(courseId), unitId: Number(unitId) })
  const { data: groupComments, refetch: refetchGroupComments } = useQuery({ ...groupCommentInstance })

  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: commentService.create,
    onSuccess: () => {
      triggerAlert('Create comment successfully')
      closeComment()
      refetchGroupComments()
    },
  })

  const {
    anchorEl: anchorElActions,
    isOpen: isOpenMenuActions,
    onClose: closeMenuActions,
    onOpen: openMenuActions,
  } = useMenu()

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

  const handleCreateComment = () => {
    mutateCreateComment({
      assignmentId: Number(assignmentId),
      content: comment,
      unitId: Number(unitId),
      courseId: Number(courseId),
      ...(groupComments?.content[0] && {
        groupCommentId: groupComments?.content[0].id,
      }),
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

  const totalComments = groupComments?.content.reduce(
    (total, groupComment) => total + groupComment.commentInfo.length,
    0,
  )

  return (
    <Card>
      <CardContent>
        <Flex gap={1} alignItems='center'>
          <PeopleAltRounded />
          <Typography>Comment ({totalComments})</Typography>
        </Flex>
        <Button onClick={openComment}>Add your comment</Button>

        {isOpenComment && (
          <Card variant='outlined' sx={{ my: 2 }}>
            <CardContent>
              <Flex gap={1}>
                <Avatar src={profile?.data.avatarPath} sx={{ width: 35, height: 35 }}>
                  {profile?.data.fullName.charAt(0)}
                </Avatar>
                <Typography variant='body2' fontWeight={700}>
                  {profile?.data.fullName}
                </Typography>
              </Flex>
              <ContentEditable placeholder='Type your content...' value={comment} onChange={setComment} />
              <Flex justifyContent='end' gap={1}>
                <Button onClick={closeComment}>Cancel</Button>
                <Button variant='contained' onClick={handleCreateComment}>
                  Submit
                </Button>
              </Flex>
            </CardContent>
          </Card>
        )}
        <Stack gap={4}>
          {groupComments?.content.map(
            (groupComment) =>
              groupComment.commentInfo.length > 0 && (
                <Card key={groupComment.id} variant='outlined'>
                  <CardContent>
                    <Stack gap={1}>
                      {groupComment.commentInfo.map((comment, index) => (
                        <>
                          {index > 0 && <Divider sx={{ my: 1 }} />}
                          <Stack key={comment.id}>
                            <Flex gap={1} position='relative'>
                              <Avatar
                                src={(comment.studentInfo || comment.teacherInfo)?.avatarPath}
                                sx={{ width: 35, height: 35 }}
                              >
                                {(comment.studentInfo || comment.teacherInfo)?.fullName.charAt(0)}
                              </Avatar>
                              <Stack>
                                <Typography variant='body2' fontWeight={700}>
                                  {(comment.studentInfo || comment.teacherInfo)?.fullName}
                                </Typography>
                                <Typography variant='caption'>{formatDate.toRelative(comment.createDate)}</Typography>
                              </Stack>
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
                            <Typography pl={5} variant='body2' mt={1}>
                              {comment.content}
                            </Typography>
                          </Stack>
                        </>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ),
          )}
        </Stack>
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
        <ConfirmPopup
          subtitle='Would you like to delete this comment'
          isOpen={isOpenConfirmDelete}
          onAccept={handleDeleteComment}
          onClose={closeConfirmDelete}
          type='delete'
        />
      </CardContent>
    </Card>
  )
}
