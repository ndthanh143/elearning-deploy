import { BoxContent, Loading, NoData, PageContentHeading } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { TeacherCourseCard as CourseCard, ModalCreateCourse } from './components'
import { courseKeys } from '@/services/course/course.query'
import { useQuery } from '@tanstack/react-query'

export const TeacherCoursesPage = () => {
  const { profile } = useAuth()

  const { value: isOpenCreateCourse, setTrue: openCreateCourse, setFalse: closeCreateCourse } = useBoolean(false)

  const courseInstance = courseKeys.list({ teacherId: Number(profile?.data.id) })
  const { data: courses, isFetched, isLoading } = useQuery({ ...courseInstance, enabled: Boolean(profile) })

  return (
    profile && (
      <Box>
        <PageContentHeading
          title={`Brainstone: Professional Development Courses for Teaching Excellence`}
          subTitle='Unlocking the Potential of Educators through Comprehensive and Specialized Training Programs'
        />
        <Grid container>
          <Grid item xs={8}>
            <BoxContent height='70vh' display='flex' flexDirection='column'>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant='h5' mb={2}>
                  Your courses
                </Typography>
                {courses && courses.content.length && (
                  <Button variant='contained' size='small' sx={{ my: 1 }} onClick={openCreateCourse}>
                    Create new Course
                  </Button>
                )}
              </Stack>
              {isLoading ? (
                <Box display='flex' alignItems='center' height='100%'>
                  <Loading />
                </Box>
              ) : (
                <Stack gap={2} maxHeight='100%' sx={{ overflowY: 'scroll' }}>
                  {courses?.content.map((course) => <CourseCard key={course.id} data={course} />)}
                </Stack>
              )}

              {isFetched && !courses?.content.length && (
                <Stack alignItems='center' gap={2} justifyContent='center' height='100%'>
                  <NoData title='You have no courses currently' />
                  <Button variant='outlined' sx={{ width: 'fit-content' }} onClick={openCreateCourse}>
                    Create new Courses
                  </Button>
                </Stack>
              )}
            </BoxContent>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        <ModalCreateCourse isOpen={isOpenCreateCourse} onClose={closeCreateCourse} />
      </Box>
    )
  )
}
