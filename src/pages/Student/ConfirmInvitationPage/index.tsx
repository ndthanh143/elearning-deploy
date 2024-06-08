import { Button, Flex } from '@/components'
import { useAlert, useAuth } from '@/hooks'
import { studentService } from '@/services'
import { courseKeys } from '@/services/course/course.query'
import { primary } from '@/styles/theme'
import { decodeBase64, getAbsolutePathFile } from '@/utils'
import { Avatar, Box, Card, CardContent, Chip, Container, Stack, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function ConfirmInvitationPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams, _] = useSearchParams()
  const token = searchParams.get('token')
  const decodedToken = decodeBase64(token || '')
  const [email, courseId] = decodedToken.split('&') || []

  const { triggerAlert } = useAlert()

  const { mutate: mutateConfirm } = useMutation({
    mutationFn: studentService.confirmInvitation,
    onSuccess: () => {
      triggerAlert('Join course successfully', 'success')
      navigate(`/courses/${courseId}`)
    },
    onError: () => {
      triggerAlert('Join course failed', 'error')
    },
  })

  const handleConfirm = () => {
    mutateConfirm(token || '')
  }

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: courseData } = useQuery({ ...courseInstance, enabled: Boolean(courseId) })

  return (
    profile && (
      <Container>
        {profile.data.email === email ? (
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
            gap={1}
          >
            <Typography variant='h2' fontWeight={700}>
              Confirm Invitation
            </Typography>
            <Typography variant='body1' gutterBottom>
              You have been invited to join this course.
            </Typography>
            {courseData && (
              <Card sx={{ filter: `drop-shadow(0 0 0.5rem ${primary[200]})` }}>
                <CardContent>
                  <Flex gap={2} alignItems='start'>
                    <Box
                      component='img'
                      src={getAbsolutePathFile(courseData.thumbnail) || ''}
                      height={120}
                      borderRadius={3}
                    />
                    <Stack gap={1}>
                      <Typography fontWeight={700}>{courseData.courseName}</Typography>
                      <Chip
                        label={courseData.categoryInfo?.name}
                        sx={{ width: 'fit-content' }}
                        color='primary'
                        size='small'
                      />
                      <Flex gap={1}>
                        <Avatar src={courseData.teacherInfo.avatarPath} />
                        <Typography fontWeight={700}>{courseData.teacherInfo.fullName}</Typography>
                      </Flex>
                    </Stack>
                  </Flex>
                </CardContent>
              </Card>
            )}
            <Button variant='contained' color='primary' onClick={handleConfirm} sx={{ mt: 2 }} size='large'>
              Join Course
            </Button>
          </Stack>
        ) : (
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
            gap={1}
          >
            <Typography variant='h2' fontWeight={700}>
              This invitation is not for you
            </Typography>
          </Stack>
        )}
      </Container>
    )
  )
}
