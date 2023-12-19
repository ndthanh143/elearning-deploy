import common from '@/assets/images/icons/common'
import { Course } from '@/services/course/course.dto'
import { getAbsolutePathFile } from '@/utils'
import { Groups } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

export type TeacherCourseCardProps = {
  data: Course
}

export const TeacherCourseCard = ({ data }: TeacherCourseCardProps) => {
  const navigate = useNavigate()
  const handleClick = () => navigate(`/courses/${data.id}`)

  return (
    <Stack
      maxHeight={200}
      direction='row'
      gap={2}
      alignItems='center'
      p={1}
      m={-1}
      borderRadius={3}
      sx={{
        cursor: 'pointer',
        ':hover': {
          bgcolor: blue[50],
        },
      }}
      onClick={handleClick}
    >
      <Box
        component='img'
        src={getAbsolutePathFile(data.thumbnail) || common.course}
        width={100}
        height={100}
        borderRadius={3}
        sx={{ objectFit: 'cover' }}
      />
      <Stack gap={1}>
        <Typography fontWeight={500}>{data.courseName}</Typography>
        <Typography textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
          {data.description}
        </Typography>
        <Stack direction='row' alignItems='center' gap={1}>
          <Groups />
          <Typography variant='body2'>20 students</Typography>
          &#x2022;
          <Typography variant='body2'>{data.modulesInfo?.length || 0} Section</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
