import { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Flex } from '..'
import { useQuery } from '@tanstack/react-query'
import { courseKeys } from '@/services/course/course.query'
import { Box, Stack } from '@mui/material'
import { useAuth, useBoolean } from '@/hooks'
import { LessonLayoutHeader, SideContentCourse } from './components'

export function LessonLayout() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { accessToken, profile, isFetched } = useAuth()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course } = useQuery(courseInstance)

  const { value: isOpenSideContent, toggle: toggleSideContent } = useBoolean(false)

  useEffect(() => {
    const pathname = window.location.href.replace(window.location.origin, '')
    if (!accessToken) {
      navigate('/login', {
        state: {
          from: pathname,
        },
      })
    }
    if (!profile && isFetched) {
      navigate('/login', {
        state: {
          from: pathname,
        },
      })
    }
  }, [profile])

  return (
    <Stack bgcolor='#F8F4FE' height='100vh' width='100vw' sx={{ overflowY: 'hidden' }}>
      <Box flex={1}>
        <LessonLayoutHeader toggleSideContent={toggleSideContent} course={course} />
      </Box>
      <Flex height='100%'>
        <Stack height='100%' maxWidth='100vw' sx={{ overflowY: 'scroll' }} flex={1} pb={8}>
          <Outlet />
        </Stack>
        <Stack
          gap={2}
          pt={1}
          width={isOpenSideContent ? 3 / 12 : 0}
          overflow='hidden'
          height='100%'
          px={isOpenSideContent ? 1 : 0}
          sx={{
            visibility: isOpenSideContent ? 'visible' : 'hidden',
            opacity: isOpenSideContent ? 1 : 0,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {course && <SideContentCourse lessonPlan={course.lessonPlanInfo} />}
        </Stack>
      </Flex>
    </Stack>
  )
}
