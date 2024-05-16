import { BoxContent, Flex, Loading, NoData } from '@/components'
import { Avatar, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { useAlert, useAuth, useBoolean } from '@/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { topicKeys } from '@/services/topic/topic.query'
import { ForumTopic } from '../CourseDetailPage/components/ForumTopic'
import { forumKeys } from '@/services/forum/forum.query'
import { ModalActionsTopic } from '../CourseDetailPage/components'
import { topicService } from '@/services/topic/topic.service'
import { useParams } from 'react-router-dom'

export const ForumDetailPage = () => {
  const { triggerAlert } = useAlert()
  const { id: forumId } = useParams()
  const queryClient = useQueryClient()

  const { profile } = useAuth()

  const { value: isOpenCreateTopic, setTrue: openCreateTopic, setFalse: closeCreateTopic } = useBoolean(false)

  const forumsInstance = forumKeys.detail(Number(forumId))
  const { data: forum } = useQuery({ ...forumsInstance, enabled: Boolean(profile) })

  const topicInstance = topicKeys.list({ forumId: Number(forum?.id) })
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
    forum && (
      <Container>
        <Typography variant='h4' fontWeight={500} mb={2}>
          {forum.forumTitle}
        </Typography>
        <Stack gap={3}>
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
              <Card>
                <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar src={profile?.data.avatarPath}>{profile?.data.fullName.charAt(0)}</Avatar>
                  <Button variant='outlined' fullWidth color='secondary' onClick={openCreateTopic}>
                    Whats on your mind?
                  </Button>
                </CardContent>
              </Card>
              {topics.map((topic) => (
                <Card key={topic.id}>
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
      </Container>
    )
  )
}
