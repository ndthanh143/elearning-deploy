import { BoxContent, Loading, NoData, PageContentHeading } from '@/components'
import { useAuth } from '@/hooks'
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import { TeacherCourseCard } from './components'
import { courseKeys } from '@/services/course/course.query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { courseService } from '@/services/course/course.service'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const DEFAULT_LIMIT = 10
export const TeacherCoursesPage = () => {
  const { profile } = useAuth()

  const [page, setPage] = useState(0)

  const navigate = useNavigate()
  // const queryClient = useQueryClient()

  const handeRedirectCreateCourse = () => {
    navigate('/courses/create')
  }

  const courseInstance = courseKeys.list({ teacherId: Number(profile?.data.id), page, size: DEFAULT_LIMIT })
  const { data: courses, isFetched, isLoading, refetch } = useQuery({ ...courseInstance, enabled: Boolean(profile) })

  const { mutate: mutateDeleteCourse } = useMutation({
    mutationFn: courseService.delete,
    onSuccess: () => {
      // if (courses) {
      //   const newCourses = courses
      //   newCourses.content = newCourses?.content.filter((course) => course.id !== selectedCourse)

      //   queryClient.setQueriesData({ queryKey: courseInstance.queryKey }, newCourses)
      // }
      refetch()
      toast.success('Delete course successfully')
    },
  })

  return (
    profile && (
      <Container>
        <PageContentHeading
          title={`Brainstone: Professional Development Courses for Teaching Excellence`}
          subTitle='Unlocking the Potential of Educators through Comprehensive and Specialized Training Programs'
        />
        <Grid container>
          <Grid item xs={12}>
            <BoxContent minHeight='70vh' display='flex' flexDirection='column' justifyContent='space-between'>
              <Box>
                <Stack direction='row' justifyContent='space-between' alignItems='center' mb={4}>
                  <Typography variant='h5' fontWeight={700}>
                    Your courses
                  </Typography>
                  {courses && courses.content.length && (
                    <Button variant='contained' onClick={handeRedirectCreateCourse}>
                      Create new course
                    </Button>
                  )}
                </Stack>
                {isLoading ? (
                  <Box display='flex' alignItems='center' height='100%'>
                    <Loading />
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    {courses?.content.map((course) => (
                      <Grid item xs={4} key={course.id}>
                        <TeacherCourseCard data={course} onDelete={mutateDeleteCourse} />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {isFetched && !courses?.content.length && (
                  <Stack alignItems='center' gap={2} justifyContent='center' height='100%'>
                    <NoData title='You have no courses currently' />
                    <Button variant='outlined' sx={{ width: 'fit-content' }} onClick={handeRedirectCreateCourse}>
                      Create new Courses
                    </Button>
                  </Stack>
                )}
              </Box>
            </BoxContent>
          </Grid>
        </Grid>
      </Container>
    )
  )
}
