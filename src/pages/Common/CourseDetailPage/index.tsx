import { Box, Container, Divider, Fab, Stack, Tooltip } from '@mui/material'
import { ModalLoading } from '../../../components'
import { useParams } from 'react-router-dom'
import { courseKeys } from '../../../services/course/course.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BasicPlanStudent, CourseIntro, TopicList } from './containers'
import { ModalActionsTopic } from './components'
import { useAuth, useBoolean } from '@/hooks'
import { topicService } from '@/services/topic/topic.service'
import { topicKeys } from '@/services/topic/topic.query'
import { toast } from 'react-toastify'
import { TopicOutlined } from '@mui/icons-material'
import { MindMapStudent } from '@/components/MindMap/MindMapStudent'
import { CourseFooter } from './containers/CourseFooter'

export const CourseDetailPage = () => {
  const queryClient = useQueryClient()

  const { courseId } = useParams()

  const { profile } = useAuth()

  const { value: isOpenCreateTopic, setFalse: closeCreateTopic } = useBoolean(false)
  const { value: isOpenTopic, setFalse: closeTopic, setTrue: openTopics } = useBoolean(false)

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course } = useQuery(courseInstance)

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
      mutateCreateTopic({ forumId: Number(course.forumInfo?.id), accountId: profile.data.id, topicContent: values })
    }
  }

  return (
    course && (
      <>
        <Container>
          <Box>
            <Stack direction='column' gap={4}>
              {course.lessonPlanInfo && (
                <>
                  {course.lessonPlanInfo.type === 'mindmap' ? (
                    <MindMapStudent lessonPlan={course.lessonPlanInfo} />
                  ) : (
                    <>
                      <CourseIntro data={course} />
                      <BasicPlanStudent lessonPlan={course.lessonPlanInfo} />
                      <CourseFooter data={course} />
                    </>
                  )}
                </>
              )}
            </Stack>
          </Box>

          <ModalActionsTopic
            isOpen={isOpenCreateTopic}
            onClose={closeCreateTopic}
            onSubmit={handleCreateTopic}
            status='create'
          />
          <ModalLoading isOpen={isPendingCreateTopic} />
          <Tooltip title='Open topics'>
            <Fab
              sx={{
                position: 'absolute',
                bottom: 50,
                right: 50,
                visibility: isOpenTopic ? 'hidden' : 'visible',
                transition: 'all ease 0.1s',
              }}
              onClick={openTopics}
              color='primary'
            >
              <TopicOutlined />
            </Fab>
          </Tooltip>
        </Container>
        {course.id && <TopicList forumId={course.id} isOpen={isOpenTopic} onClose={closeTopic} />}
      </>
    )
  )
}
