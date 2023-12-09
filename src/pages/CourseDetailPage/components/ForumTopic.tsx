import { useAuth, useBoolean, useMenu } from '@/hooks'
import { Topic } from '@/services/topic/topic.dto'
import { topicKeys } from '@/services/topic/topic.query'
import { CreateTopicCommentPayload, TopicComment } from '@/services/topicComment/topicComment.dto'
import { topicCommentService } from '@/services/topicComment/topicComment.service'
import { formatDate } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { MoreHorizOutlined, MoreVert, PeopleAltOutlined, SendOutlined } from '@mui/icons-material'
import { Avatar, Box, Collapse, Divider, IconButton, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { number, object, string } from 'yup'

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

  const { value, toggle } = useBoolean(false)

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

  const { mutate: mutateCreateComment } = useMutation({
    mutationFn: topicCommentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic'] })
      resetField('content')
    },
  })

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: topicCommentService.delete,
    onSuccess: () => {
      closeMenuComment()
      toast.success('Remove your comment successfully!')
      queryClient.invalidateQueries({ queryKey: topicKeys.all })
    },
  })

  const onSubmitHandler = (data: CreateTopicCommentPayload) => {
    mutateCreateComment(data)
  }

  const handleDeleteComment = (comment: TopicComment) => mutateDeleteComment(comment.id)

  return (
    <>
      <Stack gap={2}>
        <Stack direction='row' justifyContent='space-between'>
          <Stack direction='row' alignItems='center' gap={1}>
            <Avatar src={data.accountInfo.avatarPath} />
            <Stack>
              <Typography fontWeight={500}>{data.accountInfo.fullName}</Typography>
              <Typography variant='caption'>{formatDate.toCommon(data.createDate)}</Typography>
            </Stack>
          </Stack>
          {data.accountInfo.id === profile?.data.id && (
            <IconButton onClick={openMore}>
              <MoreVert />
            </IconButton>
          )}
        </Stack>
        <Typography variant='body2' lineHeight={2}>
          {data.topicContent}
        </Typography>
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
                    <Avatar>N</Avatar>
                    <Stack gap={0.5}>
                      <Box display='flex' alignItems='center' gap={1}>
                        <Typography variant='body2' fontWeight={500}>
                          {comment.accountInfo.fullName}
                        </Typography>
                        <Typography variant='caption'>{formatDate.toDateTime(comment.createDate)}</Typography>
                      </Box>
                      <Typography variant='body2'>{comment.content}</Typography>
                    </Stack>
                  </Box>
                  {comment.accountInfo.id == profile?.data.id && (
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
                          horizontal: 'center',
                        }}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          },
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
            <Avatar>T</Avatar>
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
        <MenuItem>Edit</MenuItem>
        <MenuItem>Remove</MenuItem>
      </Menu>
    </>
  )
}
