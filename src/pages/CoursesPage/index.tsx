import { Box, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '@/hooks'
import { coursesRegistrationKeys } from '@/services/coursesRegistration/coursesRegistration.query'
import { BoxContent, CourseCard, PageContentHeading } from '@/components'
import { ListSchedule } from './components'
import { TeacherCoursesPage } from '../Teacher/TeacherCoursesPage'

const DEFAULT_PAGE_SIZE = 3
export const CoursesPage = () => {
  const { profile } = useAuth()

  const [page, setPage] = useState(0)

  const coursesInstance = coursesRegistrationKeys.list({
    studentId: Number(profile?.data.id),
    page,
    size: DEFAULT_PAGE_SIZE,
  })

  const { data: courses, isFetching } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile),
  })

  if (profile?.data.roleInfo.name === 'Teacher') {
    return <TeacherCoursesPage />
  }

  return (
    <Box>
      <PageContentHeading />

      <Grid container spacing={4}>
        <Grid item xs={8}>
          <BoxContent>
            <Box display='flex' justifyContent='space-between' my={1}>
              <Typography variant='h6'>All courses</Typography>
            </Box>

            {isFetching && (
              <Box p={2}>
                <Skeleton height={250} sx={{ borderRadius: 3 }} />
              </Box>
            )}
            {courses && (
              <>
                {courses.content.map((course) => (
                  <CourseCard key={course.id} data={course.courseInfo} />
                ))}
                <Pagination
                  count={courses.totalPages}
                  page={page + 1}
                  onChange={(_, newPage) => setPage(newPage - 1)}
                  color='primary'
                  sx={{ display: 'flex', justifyContent: 'center', my: 2 }}
                />
              </>
            )}
          </BoxContent>
        </Grid>
        <Grid item xs={4}>
          <Stack gap={3}>
            <BoxContent maxHeight='73vh' sx={{ overflow: 'hidden' }}>
              <ListSchedule />
            </BoxContent>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
