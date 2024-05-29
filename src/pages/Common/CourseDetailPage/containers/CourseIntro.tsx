import { Course } from '@/services/course/course.dto'
import { ArrowBack, Check, FiberManualRecord } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { NoData } from '@/components'

export type CourseIntroProps = {
  data: Course
}

export const CourseIntro = ({ data }: CourseIntroProps) => {
  const navigate = useNavigate()

  const handleBackToCourses = () => {
    navigate('/courses')
  }

  return (
    <Stack gap={1}>
      <Stack direction='row' justifyContent='space-between'>
        <Button color='primary' onClick={handleBackToCourses} startIcon={<ArrowBack fontSize='small' />}>
          Courses
        </Button>
      </Stack>
      <Card>
        <CardContent>
          <Stack gap={3}>
            <Typography variant='h6' fontWeight={500}>
              {data.courseName}
            </Typography>
            <Stack direction='row' gap={1} alignItems='center'>
              <Avatar
                src={data.teacherInfo.avatarPath}
                alt={data.teacherInfo.fullName}
                sx={{ width: 30, height: 30 }}
              />
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
        </CardContent>
      </Card>
    </Stack>
  )
}
