import { Flex, Loading, NoData } from '@/components'
import { Avatar, Box, Button, Card, CardContent, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { ForumTopic, ModalActionsTopic } from '../components'
import { topicKeys } from '@/services/topic/topic.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { KeyboardDoubleArrowRightOutlined } from '@mui/icons-material'
import { useAlert, useAuth, useBoolean } from '@/hooks'
import { topicService } from '@/services/topic/topic.service'

export type TopicList = {
  forumId: number
  isOpen: boolean
  onClose: () => void
}

export const TopicList = ({ forumId, isOpen, onClose }: TopicList) => {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  const { value: isOpenCreateTopic, setTrue: openCreateTopic, setFalse: closeCreateTopic } = useBoolean(false)

  const topicInstance = topicKeys.list({ forumId })
  const {
    data: topics,
    isFetched: isFetchedTopics,
    isLoading: isLoadingTopics,
  } = useQuery({ ...topicInstance, enabled: Boolean(forumId) })

  const { mutate: mutateCreateTopic } = useMutation({
    mutationFn: topicService.create,
    onSuccess: (data) => {
      queryClient.setQueryData(topicInstance.queryKey, [{ ...data, commentInfo: [] }, ...(topics || [])])
      triggerAlert('Create Topic successfully!')
    },
    onSettled: () => closeCreateTopic(),
  })

  const handleCreateTopic = (values: string) => {
    if (profile) {
      mutateCreateTopic({ forumId: Number(forumId), accountId: profile.data.id, topicContent: values })
    }
  }

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          width: isOpen ? 600 : 0,
          position: 'absolute',
          overflow: 'hidden',
          zIndex: 100,
          overflowY: 'scroll',
          bgcolor: 'white',
          borderColor: '#ccc',
          boxShadow: 1,
          right: 0,
          bottom: 0,
          top: 0,
          transition: 'all 0.2s ease-in-out',
        }}
        // ref={notiRef}
      >
        <Flex gap={1}>
          <Flex px={3} py={2} gap={1}>
            <Tooltip title='Close Topics'>
              <IconButton size='small' onClick={onClose} color='primary'>
                <KeyboardDoubleArrowRightOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
            <Typography variant='body2' fontWeight={500}>
              List topics
            </Typography>
          </Flex>
        </Flex>
        <Divider />
        <Stack gap={3} p={3}>
          {isLoadingTopics && (
            <Flex height='80vh' alignItems='center'>
              <Loading />
            </Flex>
          )}
          {(isFetchedTopics && !topics?.length) || !topics?.length ? (
            <Flex>
              <Stack width='100%' gap={2} maxWidth={500} mx='auto'>
                <NoData title="There isn't any topic yet!" />
                <Button fullWidth variant='contained'>
                  Create first topic
                </Button>
              </Stack>
            </Flex>
          ) : (
            <>
              <Card variant='outlined'>
                <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar src={profile?.data.avatarPath}>{profile?.data.fullName.charAt(0)}</Avatar>
                  <Button variant='outlined' fullWidth color='primary' onClick={openCreateTopic}>
                    Whats on your mind?
                  </Button>
                </CardContent>
              </Card>
              {topics.map((topic) => (
                <Card key={topic.id} variant='outlined'>
                  <CardContent>
                    <ForumTopic data={topic} key={topic.id} />
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </Stack>
        <ModalActionsTopic
          isOpen={isOpenCreateTopic}
          onClose={closeCreateTopic}
          onSubmit={handleCreateTopic}
          status='create'
        />
      </Box>
    </>
  )
}
