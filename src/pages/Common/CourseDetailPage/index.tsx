import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { courseKeys } from '../../../services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { BasicPlanStudent, CourseIntro, TopicFab } from './containers'
import { MindMapStudent } from '@/components/MindMap/MindMapStudent'
import { CourseFooter } from './containers/CourseFooter'
import { ModalWelcome } from './components'
import { useAuth, useBoolean } from '@/hooks'
import { Button, Flex, Link, Loading, NoData } from '@/components'

export const CourseDetailPage = () => {
  const { isStudent } = useAuth()
  const { courseId } = useParams()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course, isLoading: isLoadingCourse } = useQuery(courseInstance)

  const { value: isShowWelcome, setFalse: hideWelcome } = useBoolean(isStudent && course?.isFirstJoin)

  const renderContent = {
    mindmap: course?.lessonPlanInfo && (
      <MindMapStudent lessonPlan={course.lessonPlanInfo} isLoading={isLoadingCourse} />
    ),
    basic: course?.lessonPlanInfo && <BasicPlanStudent lessonPlan={course.lessonPlanInfo} />,
  }

  if (isLoadingCourse && !course) {
    return (
      <Flex height='90vh' justifyContent='center'>
        <Loading />
      </Flex>
    )
  }

  return (
    course && (
      <>
        <Container>
          <Box>
            <Stack direction='column' gap={4}>
              {course && (
                <>
                  <CourseIntro data={course} />

                  {course.lessonPlanInfo?.type ? (
                    renderContent[course.lessonPlanInfo.type]
                  ) : (
                    <Stack gap={1}>
                      <Typography fontWeight={700}>Content</Typography>
                      <Card>
                        <CardContent>
                          <Stack alignItems='center' gap={1}>
                            <NoData title='Your course have no plan selected, please select your plan to update your content!' />
                            <Link href={`/courses/${courseId}/manage`}>
                              <Button>Update plan</Button>
                            </Link>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Stack>
                  )}
                  <CourseFooter data={course} />
                </>
              )}
            </Stack>
          </Box>

          <TopicFab courseId={course.id} />
        </Container>

        {course.welcome && <ModalWelcome message={course.welcome} isOpen={isShowWelcome} onClose={hideWelcome} />}
      </>
    )
  )
}
