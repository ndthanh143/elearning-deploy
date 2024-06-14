import { Flex, Loading, NoData, Button } from '@/components'
import { useAuth } from '@/hooks'
import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import { TeacherCourseCard } from './components'
import { courseKeys } from '@/services/course/course.query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { courseService } from '@/services/course/course.service'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AddOutlined } from '@mui/icons-material'
import { BannerHeading } from '@/pages/Student/StudentHomePage/components'

const DEFAULT_LIMIT = 20
export const TeacherCoursesPage = () => {
  const { profile } = useAuth()

  const [page, _] = useState(0)

  const navigate = useNavigate()

  const handeRedirectCreateCourse = () => {
    navigate('/courses/create')
  }

  const courseInstance = courseKeys.list({ teacherId: Number(profile?.data.id), page, size: DEFAULT_LIMIT })
  const { data: courses, isFetched, isLoading, refetch } = useQuery({ ...courseInstance, enabled: Boolean(profile) })

  const { mutate: mutateDeleteCourse } = useMutation({
    mutationFn: courseService.delete,
    onSuccess: () => {
      refetch()
      toast.success('Delete course successfully')
    },
  })

  return (
    profile && (
      <Container>
        <Stack gap={4}>
          <BannerHeading
            title={`Brainstone: Professional Development Courses for Teaching Excellence`}
            subtitle='Unlocking the Potential of Educators through Comprehensive and Specialized Training Programs'
          />

          <Stack gap={2}>
            <Flex justifyContent='space-between' gap={2} alignItems='center'>
              <Typography fontWeight={700}>Your courses</Typography>
              {courses && !!courses.content.length && (
                <Button variant='contained' onClick={handeRedirectCreateCourse} startIcon={<AddOutlined />}>
                  Create new course
                </Button>
              )}
            </Flex>
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
              <Stack alignItems='center' gap={2} justifyContent='center' height='100%' mt={2}>
                <NoData title='You have no courses currently' />
                <Button variant='contained' sx={{ width: 'fit-content' }} onClick={handeRedirectCreateCourse}>
                  Create new Courses
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Container>
    )
  )
}
