import { ArrowForward } from '@mui/icons-material'
import { Box, Button, Grid, Typography } from '@mui/material'
import { courses } from './HomePage'
import { CourseCard, PageContentHeading } from '../components'
import { useAuth } from '../hooks'
import { useQuery } from '@tanstack/react-query'
import { defineQuery } from '../utils'
import { coursesRegistrationKeys } from '../services/coursesRegistration/coursesRegistration.query'
import { coursesRegistrationService } from '../services/coursesRegistration/coursesRegistration.service'

export const CoursesPage = () => {
  const { profile } = useAuth()

  const coursesInstance = coursesRegistrationKeys.list({ studentId: profile?.data.id as number })
  const { data: courses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile),
  })

  return (
    <Box>
      <PageContentHeading />

      <Grid container spacing={4}>
        <Grid item xs={8}>
          <Box bgcolor='#fff' padding={2} borderRadius={3}>
            <Box display='flex' justifyContent='space-between' my={1}>
              <Typography variant='h6'>All courses</Typography>
            </Box>

            {courses && courses.data.content.map((course) => <CourseCard key={course.id} data={course.courseInfo} />)}
            <Button variant='outlined' sx={{ mx: 'auto', mt: 2, display: 'block' }}>
              Load more
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box bgcolor='#fff' padding={2} borderRadius={3}>
            haha
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
