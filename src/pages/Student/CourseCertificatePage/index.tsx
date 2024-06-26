import Certificate from './components/Credential'
import { useAuth } from '@/hooks'
import { courseKeys } from '@/services/course/course.query'
import { Card, CardContent, Container, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { InfoAction } from './components'

export function CourseCertificatePage() {
  const { profile } = useAuth()
  const { courseId } = useParams()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course } = useQuery(courseInstance)

  return (
    course &&
    profile && (
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8} height='100%'>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Certificate
                  studentName={profile?.data.fullName || ''}
                  courseName={course.courseName}
                  instructorName={course.teacherInfo.fullName}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4} height='100%'>
            <InfoAction course={course} recipient={profile.data} />
          </Grid>
        </Grid>
      </Container>
    )
  )
}
