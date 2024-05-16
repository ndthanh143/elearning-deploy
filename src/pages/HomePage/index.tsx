import { Box, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material'
import { Flex } from '@/components'
import { CheckOutlined, SchoolOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { coursesRegistrationKeys } from '../../services/coursesRegistration/coursesRegistration.query'
import { useAuth } from '../../hooks'
import { useQuery } from '@tanstack/react-query'
import { Activity, FollowingCourses, InfoStudent, ListStudent } from './components'
import { RoleEnum } from '@/services/auth/auth.dto'
import { useEffect } from 'react'

export type CourseData = {
  thumbnail: string
  name: string
  description: string
}

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 10
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
      <Container maxWidth={'xl'}>
        <InfoStudent />
        <Grid container spacing={4} mt={2}>
          <Grid item xs={9}>
            <Grid container spacing={4}>
              <Grid item xs={6} height='100%'>
                <Card variant='elevation' elevation={2}>
                  <CardContent>
                    <Flex gap={2} alignItems='center'>
                      <Box
                        sx={{
                          border: 2,
                          borderRadius: '100%',
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: 'primary.main',
                        }}
                      >
                        <SchoolOutlined fontSize='large' color='primary' />
                      </Box>
                      <Stack>
                        <Typography variant='h5' fontWeight={700}>
                          {courses?.totalElements || 0}
                        </Typography>
                        <Typography>Total course</Typography>
                      </Stack>
                    </Flex>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant='elevation' elevation={2}>
                  <CardContent>
                    <Stack direction='row' gap={2} alignItems='center'>
                      <Box
                        sx={{
                          border: 2,
                          borderRadius: '100%',
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: 'success.main',
                        }}
                      >
                        <CheckOutlined fontSize='large' color='success' />
                      </Box>
                      <Stack>
                        <Typography variant='h5' fontWeight={700}>
                          0
                        </Typography>
                        <Typography>Completed course</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                {courses && <FollowingCourses courses={courses.content} />}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Stack gap={4}>
              <Activity />
              <ListStudent />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    )
  )
}
