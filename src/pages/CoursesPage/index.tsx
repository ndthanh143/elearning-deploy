import { Box, Card, CardContent, Container, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth, useBoolean } from '@/hooks'
import { coursesRegistrationKeys } from '@/services/coursesRegistration/coursesRegistration.query'
import { CourseCard } from '@/components'
import { ModalSchedule } from './components'
import { TeacherCoursesPage } from '../Teacher/TeacherCoursesPage'

const DEFAULT_PAGE_SIZE = 10
export const CoursesPage = () => {
  const { profile } = useAuth()

  const [page, setPage] = useState(0)
  const { value: isOpenModalSchedule, setTrue: openModalSchedule, setFalse: closeModalSchedule } = useBoolean()

  const coursesInstance = coursesRegistrationKeys.list({
    studentId: Number(profile?.data.id),
    page,
    size: DEFAULT_PAGE_SIZE,
  })

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile),
  })

  if (profile?.data.roleInfo.name === 'Teacher') {
    return <TeacherCoursesPage />
  }

  return (
    <>
      <Container>
        <Box display='flex' justifyContent='space-between' mb={2}>
          <Typography variant='h6'>Your courses</Typography>
        </Box>
        <Grid container spacing={4}>
          {courses &&
            courses.content.map((course) => (
              <Grid item xs={4} key={course.id}>
                <CourseCard key={course.id} data={course.courseInfo} />
              </Grid>
            ))}
          {isLoadingCourses &&
            Array.from({ length: 3 }).map((_, index) => (
              <Grid item xs={4} key={index}>
                <Card variant='outlined'>
                  <Skeleton variant='rectangular' height={200} width='100%' />
                  <CardContent>
                    <Skeleton height={20} width={200} />
                    <Skeleton variant='text' height={40} width='100%' />
                    <Skeleton variant='text' height={40} width='100%' />
                    <Skeleton variant='text' height={40} width='100%' />
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
        {courses && courses.totalPages > 1 && (
          <Pagination
            count={courses.totalPages}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            color='primary'
            sx={{ display: 'flex', justifyContent: 'center', my: 2 }}
          />
        )}
      </Container>
      <ModalSchedule isOpen={isOpenModalSchedule} onClose={closeModalSchedule} />
    </>
  )
}
