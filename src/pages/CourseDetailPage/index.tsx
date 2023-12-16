import { Box, Button, Grid, Stack } from '@mui/material'
import { BoxContent, NoData, PageContentHeading } from '../../components'
import { useParams } from 'react-router-dom'
import { courseKeys } from '../../services/course/course.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TopicList, CourseIntro, CourseContent } from './containers'
import { CourseFooter } from './containers/CourseFooter'
import { ModalCreateTopic } from './components'
import { useAuth, useBoolean } from '@/hooks'
import { topicService } from '@/services/topic/topic.service'
import { topicKeys } from '@/services/topic/topic.query'
import { toast } from 'react-toastify'

export const CourseDetailPage = () => {
  const queryClient = useQueryClient()

  const { courseId } = useParams()

  const { profile } = useAuth()

  const { value: isOpenCreateTopic, setTrue: openCreateTopic, setFalse: closeCreateTopic } = useBoolean(false)

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course } = useQuery(courseInstance)

  const { mutate: mutateCreateTopic } = useMutation({
    mutationFn: topicService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() })
      closeCreateTopic()
      toast.success('Create Topic successfully!')
    },
  })

  const handleCreateTopic = (values: string) => {
    if (profile && course) {
      mutateCreateTopic({ forumId: course.forumInfo.id, accountId: profile.data.id, topicContent: values })
    }
  }

  return (
    course && (
      <>
        <Box>
          <PageContentHeading />
          <Grid container spacing={4}>
            <Grid item xs={12} md={12} lg={8}>
              <Stack direction='column' gap={3}>
                <CourseIntro data={course} />
                <CourseContent data={course} />
                <CourseFooter data={course} />
              </Stack>
            </Grid>
            <Grid item xs={false} sm={12} lg={4}>
              <BoxContent mb={2}>
                <Button fullWidth variant='outlined' onClick={openCreateTopic}>
                  Create new Topic
                </Button>
              </BoxContent>
              {course.forumInfo ? (
                <TopicList forumId={course.forumInfo.id} />
              ) : (
                <BoxContent>
                  <NoData title='There is no any topics in this course' />
                </BoxContent>
              )}
            </Grid>
          </Grid>
        </Box>
        <ModalCreateTopic isOpen={isOpenCreateTopic} onClose={closeCreateTopic} onSubmit={handleCreateTopic} />
      </>
    )
  )
}
