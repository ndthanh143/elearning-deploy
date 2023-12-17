import { Avatar, Box, Chip, Divider, Grid, Slider, Stack, Typography } from '@mui/material'
import { CastForEducationOutlined } from '@mui/icons-material'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Course } from '../services/course/course.dto'
import { blue } from '@mui/material/colors'
import { getAbsolutePathFile } from '@/utils'
import common from '@/assets/images/icons/common'

export type CourseCardProps = {
  data: Course
}

export const CourseCard = ({ data }: CourseCardProps) => {
  const navigate = useNavigate()

  const handleOpenCourse = useCallback(() => {
    navigate(`/courses/${data.id}`)
  }, [])

  return (
    <Box
      padding={2}
      borderRadius={3}
      sx={{
        ':hover': {
          bgcolor: blue[50],
        },
        cursor: 'pointer',
        transition: 'all ease 0.15s',
      }}
      onClick={handleOpenCourse}
    >
      <Grid container spacing={2}>
        <Grid item md={12} lg={3}>
          <Box
            component='img'
            src={getAbsolutePathFile(data.thumbnail) || common.course}
            width='100%'
            height='100%'
            sx={{ objectFit: 'cover', borderRadius: 3, height: 145 }}
          />
        </Grid>
        <Grid item md={12} lg={9}>
          <Stack direction='column' spacing={2}>
            <Box>
              <Typography fontWeight={500}>{data.courseName}</Typography>
              <Typography variant='body2' sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {data.description}
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap={2}>
              <Avatar src={data.teacherInfo.avatarPath} />
              <Typography variant='body2' fontWeight={500}>
                {data.teacherInfo.fullName}
              </Typography>
              <Divider variant='middle' orientation='vertical' />
              <Box display='flex' alignItems='center' gap={1}>
                <CastForEducationOutlined />
                <Typography variant='body2'>{data.modulesInfo?.length || 0} Sections</Typography>
              </Box>
            </Box>
            <Grid container>
              <Grid item xs={6}>
                <Chip label='In Progress' sx={{ borderRadius: 3 }} color='primary' />
              </Grid>
              <Grid item xs={6}>
                <Stack direction='row' flex={1} alignItems='center' gap={1}>
                  <Slider
                    value={60}
                    sx={{
                      '.MuiSlider-thumb': {
                        display: 'none',
                      },
                      pointerEvents: 'none',
                    }}
                    valueLabelDisplay='on'
                  />
                  <Typography>60%</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
