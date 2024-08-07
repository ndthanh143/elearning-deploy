import { Container, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks'
import { FollowingCourses, BannerHeading, Overview } from './components'
import { RoleEnum } from '@/services/auth/auth.dto'
import { useEffect } from 'react'
import { icons } from '@/assets/icons'
import dayjs from 'dayjs'

export const StudentHomePage = () => {
  const navigate = useNavigate()

  const { profile, isAuthenticated } = useAuth()

  useEffect(() => {
    if (profile?.data.role === RoleEnum.Teacher) {
      navigate('/courses')
    }
  }, [profile])

  return (
    isAuthenticated ||
    (profile?.data.role === RoleEnum.Student && (
      <Container maxWidth={'xl'}>
        <Stack gap={4}>
          <BannerHeading
            title='Managing emotions helps us maintain balance in the learning process.'
            subtitle={`Take a look your learning progress for today, ${dayjs().format('MMMM DD YYYY')}`}
            buttonLabel='Explore more'
            rightIcon={icons['owl']}
          />
          <Overview />
          <FollowingCourses />
        </Stack>
      </Container>
    ))
  )
}
