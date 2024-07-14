import { Flex, Logo } from '@/components'
import { Course } from '@/services/course/course.dto'
import { primary } from '@/styles/theme'
import { BallotRounded, ExpandMore } from '@mui/icons-material'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import { ProgressCourse } from '.'
import { useAuth } from '@/hooks'

interface ILessonLayoutHeaderProps {
  toggleSideContent: () => void
  course?: Course
}

export function LessonLayoutHeader({ toggleSideContent, course }: ILessonLayoutHeaderProps) {
  const { isStudent } = useAuth()
  const handleBack = () => {
    window.history.back()
  }

  return (
    <>
      <Box sx={{ px: 4, py: 1, boxShadow: '0 1px 2px 0 rgba(0,0,0,.05)' }} position='relative' bgcolor={primary[700]}>
        <Grid container>
          <Grid item xs={6}>
            <Flex height='100%' gap={2}>
              <IconButton onClick={handleBack}>
                <ExpandMore sx={{ transform: 'rotate(90deg)', color: '#D3D6D8' }} />
              </IconButton>
              <Flex gap={1}>
                <Logo size='small' type='short' variant='light' />
                <Typography variant='body2' fontWeight={700} sx={{ color: '#fff' }}>
                  {course?.courseName}
                </Typography>
              </Flex>
            </Flex>
          </Grid>
          <Grid item xs={6} display='flex' justifyContent='end' alignItems='center' gap={4}>
            {isStudent && (
              <ProgressCourse totalLesson={course?.totalUnit || 0} totalFinish={course?.totalUnitDone || 0} />
            )}
            <Flex gap={1} sx={{ cursor: 'pointer' }} onClick={toggleSideContent}>
              <BallotRounded fontSize='small' sx={{ color: '#D3D6D8' }} />
              <Typography variant='body2' fontWeight={500} color='#fff'>
                Lesson Panel
              </Typography>
            </Flex>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
