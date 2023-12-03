import { BoxContent } from '@/components'
import { Course } from '@/services/course/course.dto'
import { Avatar, Stack, Typography } from '@mui/material'

export type CourseFooterProps = { data: Course }
export const CourseFooter = ({ data }: CourseFooterProps) => {
  return (
    <BoxContent>
      <Stack gap={1}>
        <Typography variant='h5' fontWeight={500}>
          Instructor
        </Typography>
        <Stack direction='row' gap={1}>
          <Avatar src={data.teacherInfo.fullName} alt={data.teacherInfo.fullName} sx={{ width: 60, height: 60 }} />
          <Stack justifyContent='center'>
            <Typography fontWeight={500}>{data.teacherInfo.fullName}</Typography>
            <Typography variant='body2'>{data.teacherInfo.email}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </BoxContent>
  )
}
