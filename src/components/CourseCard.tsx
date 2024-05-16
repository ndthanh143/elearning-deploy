import { Avatar, Box, Card, CardContent, CardMedia, Chip, Divider, Slider, Stack, Typography } from '@mui/material'
import { CastForEducationOutlined } from '@mui/icons-material'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Course } from '../services/course/course.dto'
import { blue } from '@mui/material/colors'
import { getAbsolutePathFile } from '@/utils'
import common from '@/assets/images/icons/common'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { useQuery } from '@tanstack/react-query'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { useAuth } from '@/hooks'

export type CourseCardProps = {
  data: Course
}

export const CourseCard = ({ data }: CourseCardProps) => {
  const { profile } = useAuth()

  const navigate = useNavigate()

  const assignmentInstance = assignmentKeys.list({ courseId: data.id })
  const { data: assignments } = useQuery({ ...assignmentInstance, select: (data) => data.content.length })

  const submissionInstance = assignmentSubmissionKeys.list({ courseId: data.id, studentId: profile?.data.id })
  const { data: submissions } = useQuery({ ...submissionInstance, select: (data) => data.content.length })

  const handleOpenCourse = useCallback(() => {
    navigate(`/courses/${data.id}`)
  }, [])

  const progress = (submissions && assignments && assignments > 0 && (submissions / assignments) * 100) || 0

  return (
    <Card
      sx={{
        ':hover': {
          bgcolor: blue[50],
          transition: 'all ease 0.15s',
        },
        cursor: 'pointer',
        transition: 'all ease 0.15s',
      }}
      onClick={handleOpenCourse}
      elevation={1}
      variant='outlined'
    >
      <CardMedia
        image={common.course || getAbsolutePathFile(data.thumbnail)}
        sx={{ objectFit: 'cover', height: 200 }}
      />
      <CardContent>
        <Stack direction='column' gap={1}>
          {data.categoryInfo && (
            <Chip
              label={data.categoryInfo?.categoryName}
              color='primary'
              size='small'
              sx={{ width: 'fit-content', fontWeight: 600, px: 2 }}
            />
          )}

          <Typography fontWeight={700} variant='body1' fontSize={18}>
            {data.courseName}
          </Typography>

          <Slider
            value={progress || 1}
            sx={{
              '.MuiSlider-thumb': {
                display: 'none',
              },
              pointerEvents: 'none',
            }}
            valueLabelDisplay='on'
          />
          {/* <Chip label={status} sx={{ borderRadius: 3 }} color={status === 'Finished' ? 'success' : 'primary'} /> */}
          <Box display='flex' alignItems='center' gap={2}>
            <Avatar src={data.teacherInfo.avatarPath} sx={{ width: 30, height: 30 }} />
            <Typography variant='body2' fontWeight={500}>
              {data.teacherInfo.fullName}
            </Typography>
            <Divider variant='middle' orientation='vertical' />
            <Box display='flex' alignItems='center' gap={1}>
              <CastForEducationOutlined />
              <Typography variant='body2'>{data.unit?.length || 0} Sections</Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
