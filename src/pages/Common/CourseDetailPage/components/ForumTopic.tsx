import { ConfirmPopup, DangerouseLyRender, ModalLoading } from '@/components'
import { useAlert, useAuth, useBoolean, useMenu } from '@/hooks'
import { Topic } from '@/services/topic/topic.dto'
import { topicKeys } from '@/services/topic/topic.query'
import { topicService } from '@/services/topic/topic.service'
import { CreateTopicCommentPayload, TopicComment } from '@/services/topicComment/topicComment.dto'
import { topicCommentService } from '@/services/topicComment/topicComment.service'
import { formatDate } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { MoreHorizOutlined, MoreVert, PeopleAltOutlined, SendOutlined } from '@mui/icons-material'
import { Avatar, Box, Collapse, Divider, IconButton, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { number, object, string } from 'yup'
import { ModalActionsTopic } from '.'

export type ForumTopicProps = {
  data: Topic
}

const schema = object({
  accountId: number().required(),
  content: string().required(),
  topicId: number().required(),
})

export const ForumTopic = ({ data }: ForumTopicProps) => {
  const queryClient = useQueryClient()
  const { triggerAlert } = useAlert()

  const { value, toggle, setTrue } = useBoolean(false)
  const { value: isOpenConfirmDelete, setTrue: openConfirmDelete, setFalse: closeConfirmDelete } = useBoolean(false)
  const { value: isOpenEdit, setTrue: openEdit, setFalse: closeEdit } = useBoolean(false)

  const { profile } = useAuth()

  const { anchorEl: anchorMore, isOpen: isOpenMore, onClose: closeMore, onOpen: openMore } = useMenu()

  const {
    anchorEl: anchorElComment,
    isOpen: isOpenMenuComment,
    onClose: closeMenuComment,
    onOpen: openMenuComment,
  } = useMenu()

  const { handleSubmit, register, resetField } = useForm<CreateTopicCommentPayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      accountId: Number(profile?.data.id),
      topicId: data.id,
    },
  })

  const { mutate: mutateDeleteTopic, isPending: isPendingDeleteTopic } = useMutation({
    mutationFn: topicService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
      triggerAlert('Delete topic successfully')
    },
  })

  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: topicCommentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
      resetField('content')
      setTrue()
    },
  })

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: topicCommentService.delete,
    onSuccess: () => {
      closeMenuComment()
      triggerAlert('Remove your comment successfully!')
      queryClient.invalidateQueries({ queryKey: topicKeys.all })
    },
  })

  const { mutate: mutateUpdateTopic, isPending: isPendingUpdateTopic } = useMutation({
    mutationFn: topicService.update,
    onSuccess: () => {
      closeEdit()
      triggerAlert('Update your topic successfully!')
      queryClient.invalidateQueries({ queryKey: topicKeys.all })
    },
  })

  const onSubmitHandler = (data: CreateTopicCommentPayload) => {
    mutateCreateComment(data)
  }

  const handleDeleteComment = (comment: TopicComment) => mutateDeleteComment(comment.id)

  const handleDeleteTopic = () => {
    mutateDeleteTopic(data.id)
  }

  const handleUpdateTopic = (topicContent: string) => {
    mutateUpdateTopic({ id: data.id, topicContent })
  }

  const accountInfo = data.teacherInfo || data.studentInfo

  return (
    <>
      <Stack gap={2}>
        <Stack direction='row' justifyContent='space-between'>
          <Stack direction='row' alignItems='center' gap={1}>
            <Avatar src={accountInfo?.avatarPath}>{accountInfo?.fullName.charAt(0)}</Avatar>
            <Stack>
              <Typography fontWeight={500}>{accountInfo?.fullName}</Typography>
              <Typography variant='caption'>{formatDate.toDateTime(new Date(data.createDate))}</Typography>
            </Stack>
          </Stack>
          {accountInfo?.id === profile?.data.id && (
            <IconButton onClick={openMore}>
              <MoreVert />
            </IconButton>
          )}
        </Stack>
        <Box height='fit-content'>
          <DangerouseLyRender content={data.topicContent} />
        </Box>
        <Divider />
        <Stack gap={2}>
          <Box display='flex' gap={1} alignItems='center' onClick={toggle} sx={{ cursor: 'pointer' }}>
            <PeopleAltOutlined />
            <Typography variant='body2'>{data.commentInfo.length} Comments about topic</Typography>
          </Box>
          <Collapse in={value}>
            <Stack gap={2}>
              {data.commentInfo.map((comment) => (
                <Box display='flex' justifyContent='space-between' key={comment.id}>
                  <Box display='flex' alignItems='start' gap={1}>
                    <Avatar src={comment.studentInfo?.avatarPath || comment.teacherInfo?.avatarPath}>
                      {(comment.studentInfo || comment.teacherInfo)?.fullName.charAt(0)}
                    </Avatar>
                    <Stack gap={0.5}>
                      <Box display='flex' alignItems='center' gap={1}>
                        <Typography variant='body2' fontWeight={500}>
                          {(comment.studentInfo || comment.teacherInfo)?.fullName}
                        </Typography>
                        <Typography variant='caption'>{formatDate.toDateTime(comment.createDate)}</Typography>
                      </Box>
                      <Typography variant='body2'>{comment.content}</Typography>
                    </Stack>
                  </Box>
                  {(comment.studentInfo || comment.teacherInfo)?.id == profile?.data.id && (
                    <>
                      <IconButton sx={{ float: 'right' }} onClick={openMenuComment}>
                        <MoreHorizOutlined />
                      </IconButton>
                      <Menu
                        anchorEl={anchorElComment}
                        open={isOpenMenuComment}
                        onClose={closeMenuComment}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem onClick={() => handleDeleteComment(comment)}>Delete</MenuItem>
                      </Menu>
                    </>
                  )}
                </Box>
              ))}
            </Stack>
          </Collapse>
          <Box component='form' onSubmit={handleSubmit(onSubmitHandler)} display='flex' gap={2} alignItems='center'>
            <Avatar src={profile?.data.avatarPath}>{profile?.data.fullName.charAt(0)}</Avatar>
            <TextField
              placeholder='Comment to topic...'
              size='small'
              variant='standard'
              fullWidth
              sx={{ fontVariant: 'body2' }}
              {...register('content')}
            />
            <IconButton type='submit'>
              <SendOutlined />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
      <Menu open={isOpenMore} anchorEl={anchorMore} onClose={closeMore}>
        <MenuItem
          onClick={() => {
            closeMore()
            openEdit()
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMore()
            openConfirmDelete()
          }}
        >
          Remove
        </MenuItem>
      </Menu>
      <ModalActionsTopic
        status='update'
        defaultValue={data.topicContent}
        onClose={closeEdit}
        onSubmit={handleUpdateTopic}
        isOpen={isOpenEdit}
        isLoading={isPendingUpdateTopic}
      />

      <ConfirmPopup
        isOpen={isOpenConfirmDelete}
        title='Confirm Delete'
        subtitle='Are you sure you want to delete this topic? This action cannot be undone'
        onClose={closeConfirmDelete}
        onAccept={handleDeleteTopic}
        type='delete'
      />
      <ModalLoading isOpen={isPendingDeleteTopic} />
    </>
  )
}
