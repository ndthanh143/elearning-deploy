import { Box, Container, Stack } from '@mui/material'
import { useParams } from 'react-router-dom'
import { courseKeys } from '../../../services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { BasicPlanStudent, CourseIntro, TopicFab } from './containers'
import { MindMapStudent } from '@/components/MindMap/MindMapStudent'
import { CourseFooter } from './containers/CourseFooter'
import { ModalWelcome } from './components'
import { useAuth, useBoolean } from '@/hooks'

export const CourseDetailPage = () => {
  const { isStudent } = useAuth()
  const { courseId } = useParams()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course, isLoading: isLoadingCourse } = useQuery(courseInstance)

  const { value: isShowWelcome, setFalse: hideWelcome } = useBoolean(isStudent && course?.isFirstJoin)

  return (
    course && (
      <>
        <Container>
          <Box>
            <Stack direction='column' gap={4}>
              {course.lessonPlanInfo && (
                <>
                  {course.lessonPlanInfo.type === 'mindmap' ? (
                    <>
                      <CourseIntro data={course} />
                      <MindMapStudent lessonPlan={course.lessonPlanInfo} isLoading={isLoadingCourse} />
                      <CourseFooter data={course} />
                    </>
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

          <TopicFab courseId={course.id} />
        </Container>

        {course.welcome && <ModalWelcome message={course.welcome} isOpen={isShowWelcome} onClose={hideWelcome} />}
      </>
    )
  )
}
