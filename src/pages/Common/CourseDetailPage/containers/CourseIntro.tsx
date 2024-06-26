import { Course } from '@/services/course/course.dto'
import { ArrowBack, Check, FiberManualRecord } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CircularProgressWithLabel, CustomMenu, CustomTooltip, Flex, NoData } from '@/components'
import { icons } from '@/assets/icons'
import { useMenu } from '@/hooks'

export type CourseIntroProps = {
  data: Course
}

const PROGRESS = Math.random() * 100

export const CourseIntro = ({ data }: CourseIntroProps) => {
  const { anchorEl, isOpen, onClose, onOpen } = useMenu()
  const navigate = useNavigate()

  const handleBackToCourses = () => {
    navigate('/courses')
  }

  const handleGetCertificate = () => {
    navigate('certificate')
  }

  return (
    <>
      {' '}
      <Stack gap={1}>
        <Flex justifyContent='space-between'>
          <Stack direction='row' justifyContent='space-between'>
            <Button color='secondary' onClick={handleBackToCourses} startIcon={<ArrowBack fontSize='small' />}>
              Courses
            </Button>
          </Stack>
          <CustomTooltip title='Bạn đã hoàn thành 7/15'>
            <Flex gap={1} sx={{ cursor: 'pointer' }} onClick={PROGRESS > 50 ? handleGetCertificate : onOpen}>
              <CircularProgressWithLabel variant='determinate' value={PROGRESS}>
                <Box width={25} height={25}>
                  {icons['cert']}
                </Box>
              </CircularProgressWithLabel>
              <Typography variant='body2'>{PROGRESS > 50 ? 'Get certificates' : 'Your progress'}</Typography>
            </Flex>
          </CustomTooltip>
        </Flex>
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
      <CustomMenu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack p={2} gap={1}>
          <Typography variant='body2' fontWeight={500}>
            You have done 1/10.
          </Typography>
          <Typography variant='body2'>Finish your course to get certificate</Typography>
        </Stack>
      </CustomMenu>
    </>
  )
}
