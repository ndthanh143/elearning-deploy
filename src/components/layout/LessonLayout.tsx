import { useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { Flex, Header, IconContainer } from '..'
import { useQuery } from '@tanstack/react-query'
import { courseKeys } from '@/services/course/course.query'
import { Box, Drawer, Grid, Stack } from '@mui/material'
import { BasicPlanStudent } from '@/pages/Common/CourseDetailPage/containers'
import { useBoolean } from '@/hooks'
import { ArrowBackRounded, ArrowForwardRounded } from '@mui/icons-material'
import { primary } from '@/styles/theme'

export function LessonLayout() {
  const { courseId } = useParams()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: course } = useQuery(courseInstance)

  const { value: isOpenDrawer, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean(false)

  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname) {
      closeDrawer()
    }
  }, [pathname])

  return (
    <Box bgcolor='#F8F4FE'>
      <Header />
      <Grid container mt={4} pb={4}>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
        {/* <Grid item xs={3}> */}

        {/* </Grid> */}
      </Grid>
      <Drawer open={isOpenDrawer} anchor='right' onClose={closeDrawer}>
        <Stack gap={2} px={2} pt={2} minWidth={400}>
          <IconContainer isActive onClick={closeDrawer} sx={{ width: 'fit-content' }}>
            <ArrowForwardRounded fontSize='small' />
          </IconContainer>
          {course && <BasicPlanStudent lessonPlan={course.lessonPlanInfo} />}
        </Stack>
      </Drawer>

      <Flex
        sx={{
          borderTopLeftRadius: 40,
          borderBottomLeftRadius: 40,
          bgcolor: primary[500],
          width: 'fit-content',
          color: 'white',
          px: 1,
          py: 1,
          position: 'fixed',
          top: '20%',
          right: 0,
          overflow: 'hidden',
          cursor: 'pointer',
          opacity: 0.7,
          ':hover': {
            opacity: 1,
          },
        }}
        onClick={openDrawer}
      >
        <ArrowBackRounded fontSize='small' sx={{ color: 'white' }} />
      </Flex>
    </Box>
  )
}
