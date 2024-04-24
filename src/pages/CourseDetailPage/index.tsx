import { Fab } from '@mui/material'
import { ModalLoading } from '../../components'
import { useParams } from 'react-router-dom'
import { courseKeys } from '../../services/course/course.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TopicList, CourseContent } from './containers'
import { ModalActionsTopic } from './components'
import { useAuth, useBoolean } from '@/hooks'
import { topicService } from '@/services/topic/topic.service'
import { topicKeys } from '@/services/topic/topic.query'
import { toast } from 'react-toastify'
import { TopicOutlined } from '@mui/icons-material'
import { MindMapStudent } from '@/components/MindMap/MindMapStudent'

export const CourseDetailPage = () => {
  const queryClient = useQueryClient()

  const { courseId } = useParams()

  const { profile } = useAuth()

  const { value: isOpenCreateTopic, setTrue: openCreateTopic, setFalse: closeCreateTopic } = useBoolean(false)
  const { value: isOpenTopics, setTrue: openTopics, setFalse: closeTopics } = useBoolean(false)

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course } = useQuery(courseInstance)

  console.log('course', course)

  const { mutate: mutateCreateTopic, isPending: isPendingCreateTopic } = useMutation({
    mutationFn: topicService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
      closeCreateTopic()
      toast.success('Create Topic successfully!')
    },
  })

  const handleCreateTopic = (values: string) => {
    if (profile && course) {
      mutateCreateTopic({ forumId: course.forumInfo?.id, accountId: profile.data.id, topicContent: values })
    }
  }

  return (
    course && (
      <>
        {/* <Box>
          <Stack direction='column' gap={3}>
            <CourseIntro data={course} />
            <CourseContent data={course} />
            <CourseFooter data={course} />
          </Stack>
        </Box> */}
        <CourseContent data={course} />

        <ModalActionsTopic
          isOpen={isOpenCreateTopic}
          onClose={closeCreateTopic}
          onSubmit={handleCreateTopic}
          status='create'
        />
        <ModalLoading isOpen={isPendingCreateTopic} />
        <Fab sx={{ position: 'absolute', bottom: 50, right: 50 }} onClick={openTopics} color='primary'>
          <TopicOutlined />
        </Fab>
        {/* <TopicList forumId={course.forumInfo?.id} isOpen={isOpenTopics} onClose={closeTopics} /> */}
      </>
    )
  )
}
