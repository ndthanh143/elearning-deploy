import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import { BoxContent, CourseCard, PageContentHeading } from '@/components'
import { ArrowForward, CheckCircleOutline, SchoolOutlined, ShowChartOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { coursesRegistrationKeys } from '../../services/coursesRegistration/coursesRegistration.query'
import { useAuth } from '../../hooks'
import { useQuery } from '@tanstack/react-query'
import { ListStudent } from './components'
import { RoleEnum } from '@/services/auth/auth.dto'
import { useEffect } from 'react'

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

  useEffect(() => {
    if (profile?.data.roleInfo.name === RoleEnum.Teacher) {
      navigate('/courses')
    }
  }, [profile])

  return (
    profile?.data.roleInfo.name === RoleEnum.Student && (
      <Box>
        <PageContentHeading />
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <BoxContent height='100%'>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    <SchoolOutlined fontSize='large' color='primary' />
                    <Stack>
                      <Typography variant='h5' fontWeight={700}>
                        {courses?.totalElements || 0}
                      </Typography>
                      <Typography>Total course</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction='row' gap={2} alignItems='center'>
                    <CheckCircleOutline fontSize='large' color='success' />
                    <Stack>
                      <Typography variant='h5' fontWeight={700}>
                        0
                      </Typography>
                      <Typography>Completed course</Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </BoxContent>
          </Grid>
          <Grid item xs={4}>
            <BoxContent>
              <Typography variant='h6'>Activity</Typography>
              <Box textAlign='center'>
                <IconButton color='primary' sx={{ border: 2 }}>
                  <ShowChartOutlined />
                </IconButton>
                <Typography my={2}>You didn't have any activity right now</Typography>
              </Box>
            </BoxContent>
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
                {/* <Button variant='text' color='primary' sx={{ gap: 1 }}>
                  View more
                  <ArrowForward />
                </Button> */}
              </Box>
              <ListStudent />
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  )
}
