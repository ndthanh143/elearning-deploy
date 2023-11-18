import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import { CourseCard, ListStudent, PageContentHeading } from '../components'
import { ArrowForward, ArrowRight, ShowChartOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { coursesRegistrationKeys } from '../services/coursesRegistration/coursesRegistration.query'
import { useAuth } from '../hooks'
import { useQuery } from '@tanstack/react-query'

export type CourseData = {
  thumbnail: string
  name: string
  description: string
}

// export const courses: CourseData[] = [
//   {
//     name: 'Learn JavaScript – Free JS Courses for Beginners',
//     description:
//       'The only course you need to become a JavaScript developer - 45 JavaScript projects, ES6, JSON, AJAX & much more!',
//     thumbnail: 'https://www.learnfly.com/img/post_img/1335475250_1_5ev1xmjs2-sj4ddejfdnqa.png',
//   },
//   {
//     name: 'Learn Java – Free JS Courses for Beginners',
//     description:
//       'The only course you need to become a JavaScript developer - 45 JavaScript projects, ES6, JSON, AJAX & much more!',
//     thumbnail: 'https://leverageedu.com/blog/wp-content/uploads/2021/11/How-to-Pursue-a-Java-Course.jpeg',
//   },
//   {
//     name: 'Learn C++ – Free JS Courses for Beginners',
//     description:
//       'The only course you need to become a JavaScript developer - 45 JavaScript projects, ES6, JSON, AJAX & much more!',
//     thumbnail:
//       'https://media.geeksforgeeks.org/wp-content/uploads/20230629144356/Best-CPP-Courses-with-Certificates.png',
//   },
//   {
//     name: 'Learn Unity – Free JS Courses for Beginners',
//     description:
//       'The only course you need to become a JavaScript developer - 45 JavaScript projects, ES6, JSON, AJAX & much more!',
//     thumbnail: 'https://img-c.udemycdn.com/course/750x422/1210008_6859.jpg',
//   },
// ]
export const HomePage = () => {
  const navigate = useNavigate()

  const { profile } = useAuth()

  const coursesInstance = coursesRegistrationKeys.list({ studentId: profile?.data.id as number })
  const { data: courses } = useQuery({ ...coursesInstance, enabled: Boolean(profile) })

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

            {courses && courses.data.content.map((course) => <CourseCard key={course.id} data={course.courseInfo} />)}
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
