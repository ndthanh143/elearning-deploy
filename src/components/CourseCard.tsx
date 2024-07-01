import { Avatar, Box, Card, CardContent, CardMedia, Chip, Slider, Stack, Typography } from '@mui/material'
import { CastForEducationOutlined } from '@mui/icons-material'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Course } from '../services/course/course.dto'
import { getAbsolutePathFile } from '@/utils'
import common from '@/assets/images/icons/common'
import { Flex } from '.'
import { primary } from '@/styles/theme'

export type CourseCardProps = {
  data: Course
}

export const CourseCard = ({ data }: CourseCardProps) => {
  const navigate = useNavigate()

  const handleOpenCourse = useCallback(() => {
    navigate(`/courses/${data.id}`)
  }, [])

  return (
    <Card
      sx={{
        ':hover': {
          bgcolor: primary[50],
          transition: 'all ease 0.15s',
        },
        cursor: 'pointer',
        transition: 'all ease 0.15s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleOpenCourse}
    >
      <CardMedia
        image={getAbsolutePathFile(data.thumbnail) || common.course}
        sx={{ objectFit: 'cover', height: 200 }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Stack direction='column' gap={1} justifyContent='space-between'>
          {data.categoryInfo && (
            <Chip
              label={data.categoryInfo?.categoryName}
              color='primary'
              size='small'
              sx={{ width: 'fit-content', fontWeight: 600, px: 1 }}
            />
          )}

          <Typography fontWeight={700} variant='body1' fontSize={18}>
            {data.courseName}
          </Typography>
          <Slider
            value={data.totalUnitDone && data.totalUnit ? (data.totalUnitDone / data.totalUnit) * 100 : 0}
            sx={{
              py: 1,
              '.MuiSlider-thumb': {
                display: 'none',
              },
              pointerEvents: 'none',
            }}
            valueLabelDisplay='on'
          />
          <Flex alignItems='center' justifyContent='space-between' gap={1}>
            <Flex gap={1}>
              <Avatar src={data.teacherInfo.avatarPath} sx={{ width: 30, height: 30, bgcolor: 'primary.main' }}>
                {data.teacherInfo.fullName[0].toUpperCase()}
              </Avatar>
              <Typography variant='body2' fontWeight={500}>
                {data.teacherInfo.fullName}
              </Typography>
            </Flex>
            <Box display='flex' alignItems='center' gap={1}>
              <CastForEducationOutlined />
              <Typography variant='body2' fontWeight={700}>
                {data.totalUnit || 0}
              </Typography>
            </Box>
          </Flex>
        </Stack>
      </CardContent>
    </Card>
  )
}
