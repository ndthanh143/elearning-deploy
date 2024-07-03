import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { blue, primary } from '@/styles/theme'
import { Link } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CourseContent } from './components'
import { getAbsolutePathFile } from '@/utils'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { coursesRegistrationService } from '@/services/coursesRegistration/coursesRegistration.service'
import { useAlert, useAuth } from '@/hooks'
import common from '@/assets/images/icons/common'

export function CoursePublicPage() {
  const { pathname } = useLocation()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { triggerAlert } = useAlert()
  const { courseId } = useParams()

  const courseInstance = courseKeys.publicDetail(Number(courseId))
  const { data: course } = useQuery({ ...courseInstance })

  const { mutate: mutateJoinCourse, isPending: isPendingJoinCourse } = useMutation({
    mutationFn: coursesRegistrationService.enroll,
    onSuccess: () => {
      triggerAlert('Join course successfully', 'success')
      navigate(`/courses/${courseId}`)
    },
    onError: () => {
      triggerAlert('Join course failed', 'error')
    },
  })

  const handleJoinCourse = () => {
    if (!profile) {
      triggerAlert('Please login to join this course', 'error')
      navigate('/login', {
        state: {
          from: pathname,
        },
      })

      return
    }
    mutateJoinCourse({ courseId: Number(courseId) })
  }

  return (
    course && (
      <Box pb={4}>
        <Box bgcolor={primary[900]} width='100vw'>
          <Container maxWidth='lg'>
            <Grid container>
              <Grid item xs={12} lg={8}>
                <Stack gap={2} py={4} mr={5}>
                  <Typography variant='h2' fontWeight={700} color='#fff'>
                    {course.courseName}
                  </Typography>
                  <Typography color='#fff'>{course.description}</Typography>
                  <Typography color='#fff'>
                    Instructor{' '}
                    <Link href='/instructor/cristiano' color={blue[400]} underline='none'>
                      {course.teacherInfo.fullName}
                    </Link>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4} position='relative'>
                <Card
                  sx={{
                    position: {
                      lg: 'absolute',
                      xs: 'relative',
                    },
                    top: {
                      lg: 50,
                      xs: 0,
                    },
                    mb: {
                      lg: 0,
                      xs: 4,
                    },
                    width: '100%',
                  }}
                >
                  <CardMedia
                    image={getAbsolutePathFile(course.thumbnail) || common.course}
                    sx={{ width: '100%', height: 250, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Stack gap={2}>
                      <Typography variant='h3' fontWeight={700} lineHeight={1.2}>
                        {course.price ? `$${course.price} ${course.currency}` : 'Free'}
                      </Typography>
                      <Button
                        variant='contained'
                        fullWidth
                        size='large'
                        onClick={handleJoinCourse}
                        disabled={isPendingJoinCourse}
                      >
                        {isPendingJoinCourse ? (
                          <CircularProgress sx={{ color: '#fff', my: 0.5 }} size={20} />
                        ) : (
                          'Join this course'
                        )}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Container maxWidth='lg' sx={{ mt: 4 }}>
          <Grid container>
            <Grid item xs={12} lg={8}>
              <Box
                mr={{
                  xs: 0,
                  lg: 5,
                }}
              >
                <CourseContent data={course} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  )
}
