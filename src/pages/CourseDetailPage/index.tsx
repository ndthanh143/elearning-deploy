import { Box, Grid, Stack } from '@mui/material'
import { BoxContent, NoData, PageContentHeading } from '../../components'
import { useParams } from 'react-router-dom'
import { courseKeys } from '../../services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { TopicList, CourseIntro, CourseContent } from './containers'
import { CourseFooter } from './containers/CourseFooter'

export const CourseDetailPage = () => {
  const { courseId } = useParams()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course } = useQuery(courseInstance)

  console.log('course', course)
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
            <Grid item xs={false} lg={4}>
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
      </>
    )
  )
}
