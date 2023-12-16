import { useAuth, useBoolean } from '@/hooks'
import { Course } from '@/services/course/course.dto'
import { ArrowBack, Check, EditOutlined, FiberManualRecord } from '@mui/icons-material'
import { Avatar, Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ModalUpdateIntro } from '../components'
import { NoData } from '@/components'

export type CourseIntroProps = {
  data: Course
}

export const CourseIntro = ({ data }: CourseIntroProps) => {
  const { profile } = useAuth()

  const navigate = useNavigate()

  const { value: isOpenUpdate, setTrue: openUpdate, setFalse: closeUpdate } = useBoolean()

  const handleBackToCourses = () => {
    navigate('/courses')
  }

  const isTeacher = profile?.data.roleInfo.name === 'Teacher'

  return (
    <Box bgcolor='#fff' padding={2} borderRadius={3}>
      <Stack direction='row' justifyContent='space-between'>
        <Button sx={{ gap: 1, mb: 1 }} color='secondary' onClick={handleBackToCourses}>
          <ArrowBack fontSize='small' />
          Courses
        </Button>
        {isTeacher && (
          <Button variant='outlined' sx={{ my: 1, display: 'flex', gap: 1 }} onClick={openUpdate}>
            <EditOutlined fontSize='small' />
            Update intro
          </Button>
        )}
      </Stack>
      <Stack gap={3}>
        <Typography variant='h6' fontWeight={500}>
          {data.courseName}
        </Typography>
        <Stack direction='row' gap={1} alignItems='center'>
          <Avatar src={data.teacherInfo.avatarPath} alt={data.teacherInfo.fullName} sx={{ width: 30, height: 30 }} />
          <Typography>{data.teacherInfo.fullName}</Typography>
        </Stack>
        <Box border={1} p={3} borderRadius={3}>
          <Typography variant='h6' mb={3}>
            What you'll learn
          </Typography>
          {data.objectives ? (
            <Grid container spacing={2}>
              {data.objectives.map((objective) => (
                <Grid item xs={6} key={objective}>
                  <Box key={objective} display='flex' alignItems='start' gap={3}>
                    <Check color='primary' />
                    <Typography>{objective}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <NoData />
          )}
        </Box>
        <Stack gap={2}>
          <Typography variant='h6'>Requirements</Typography>
          {data.requirements.map((requirement) => (
            <Box display='flex' gap={2} alignItems='center' key={requirement}>
              <FiberManualRecord fontSize='small' color='primary' />
              <Typography>{requirement}</Typography>
            </Box>
          ))}
        </Stack>
        <Stack gap={2}>
          <Typography variant='h6'>Descriptions</Typography>
          <Typography>{data.description}</Typography>
        </Stack>
      </Stack>
      {isTeacher && <ModalUpdateIntro data={data} isOpen={isOpenUpdate} onClose={closeUpdate} />}
    </Box>
  )
}
