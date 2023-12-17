import { BoxContent, Loading, NoData, PageContentHeading } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { Box, Button, Grid, Pagination, Stack, Typography } from '@mui/material'
import { TeacherCourseCard as CourseCard, ModalCreateCourse } from './components'
import { courseKeys } from '@/services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const DEFAULT_LIMIT = 5
export const TeacherCoursesPage = () => {
  const { profile } = useAuth()

  const [page, setPage] = useState(0)

  const { value: isOpenCreateCourse, setTrue: openCreateCourse, setFalse: closeCreateCourse } = useBoolean(false)

  const courseInstance = courseKeys.list({ teacherId: Number(profile?.data.id), page, size: DEFAULT_LIMIT })
  const { data: courses, isFetched, isLoading } = useQuery({ ...courseInstance, enabled: Boolean(profile) })

  return (
    profile && (
      <Box>
        <PageContentHeading
          title={`Brainstone: Professional Development Courses for Teaching Excellence`}
          subTitle='Unlocking the Potential of Educators through Comprehensive and Specialized Training Programs'
        />
        <Grid container>
          <Grid item xs={12}>
            <BoxContent minHeight='70vh' display='flex' flexDirection='column' justifyContent='space-between'>
              <Box>
                <Stack direction='row' justifyContent='space-between' mb={1}>
                  <Typography variant='h5' mb={2}>
                    Your courses
                  </Typography>
                  {courses && courses.content.length && (
                    <Button variant='contained' sx={{ my: 1 }} onClick={openCreateCourse}>
                      Create new Course
                    </Button>
                  )}
                </Stack>
                {isLoading ? (
                  <Box display='flex' alignItems='center' height='100%'>
                    <Loading />
                  </Box>
                ) : (
                  <Stack gap={2} height='100%'>
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
              </Box>
              <Pagination
                page={page + 1}
                onChange={(_, page) => setPage(page - 1)}
                sx={{ mt: 2 }}
                count={courses?.totalPages}
              />
            </BoxContent>
          </Grid>
        </Grid>
        <ModalCreateCourse isOpen={isOpenCreateCourse} onClose={closeCreateCourse} />
      </Box>
    )
  )
}
