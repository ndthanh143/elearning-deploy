import { Box, Card, CardContent, Container, Grid, Pagination, Skeleton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '@/hooks'
import { CourseCard, NoData } from '@/components'
import { BannerHeading } from '../StudentHomePage/components'
import { courseKeys } from '@/services/course/course.query'

const DEFAULT_PAGE_SIZE = 10
export const StudentCoursesPage = () => {
  const { profile } = useAuth()

  const [page, setPage] = useState(0)

  const coursesInstance = courseKeys.myCourse({
    page,
    size: DEFAULT_PAGE_SIZE,
  })

  const {
    data: courses,
    isLoading: isLoadingCourses,
    isFetched,
  } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile?.data.role === 'Student'),
  })

  return (
    <>
      <Container>
        <BannerHeading
          title='Investing in personal development improves mental health and quality of life'
          subtitle='Participate in at least one activity every day!'
        />
        <Box display='flex' justifyContent='space-between' mb={2} mt={4}>
          <Typography fontWeight={700}>Your courses</Typography>
        </Box>
        {isFetched && !isLoadingCourses && !courses?.content.length && (
          <Box mt={2}>
            <NoData title='You have no courses' />
          </Box>
        )}
        <Grid container spacing={4}>
          {courses &&
            courses.content.map((course) => (
              <Grid item xs={12} md={6} lg={3} key={course.id}>
                <CourseCard key={course.id} data={course} />
              </Grid>
            ))}
          {isLoadingCourses &&
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
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
    </>
  )
}
