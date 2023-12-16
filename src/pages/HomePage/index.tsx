import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import { CourseCard, PageContentHeading } from '@/components'
import { ArrowForward, ShowChartOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { coursesRegistrationKeys } from '../../services/coursesRegistration/coursesRegistration.query'
import { useAuth } from '../../hooks'
import { useQuery } from '@tanstack/react-query'
import { ListStudent } from './components'

export type CourseData = {
  thumbnail: string
  name: string
  description: string
}

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 2
export const HomePage = () => {
  const navigate = useNavigate()

  const { profile } = useAuth()

  const coursesInstance = coursesRegistrationKeys.list({
    studentId: profile?.data.id as number,
    page: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
  })
  const { data: courses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile),
  })

  return (
    <Box>
      <PageContentHeading />
      <Grid container spacing={4}>
        <Grid item xs={8}></Grid>
        <Grid item xs={4}>
          <Box bgcolor='#fff' padding={2} borderRadius={3}>
            <Typography variant='h6'>Activity</Typography>
            <Box textAlign='center'>
              <IconButton color='primary' sx={{ border: 2 }}>
                <ShowChartOutlined />
              </IconButton>
              <Typography my={2}>You didn't have any activity right now</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box bgcolor='#fff' padding={2} borderRadius={3}>
            <Box display='flex' justifyContent='space-between' my={1}>
              <Typography variant='h6'>Current courses</Typography>
              <Button variant='text' color='primary' sx={{ gap: 1 }} onClick={() => navigate('/courses')}>
                All courses
                <ArrowForward fontSize='small' />
              </Button>
            </Box>

            <Box height='40vh'>
              {courses && courses.content.map((course) => <CourseCard key={course.id} data={course.courseInfo} />)}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box bgcolor='#fff' padding={2} borderRadius={3}>
            <Box display='flex' justifyContent='space-between' my={1}>
              <Typography variant='h6'>Online student</Typography>
              <Button variant='text' color='primary' sx={{ gap: 1 }}>
                View more
                <ArrowForward />
              </Button>
            </Box>
            <ListStudent />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
