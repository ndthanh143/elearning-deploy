import { icons } from '@/assets/icons'
import common from '@/assets/images/icons/common'
import { Flex, Link } from '@/components'
import { Course } from '@/services/course/course.dto'
import { gray } from '@/styles/theme'
import { getAbsolutePathFile } from '@/utils'
import { Box, Grid, Stack, Typography } from '@mui/material'

export function CourseSearchedCard({ data }: { data: Course }) {
  return (
    <Link href={`/search/${data.id}`} underline='none'>
      <Grid container spacing={2}>
        <Grid item xs={3.5}>
          <Box height={120}>
            <Box
              component='img'
              width={'100%'}
              height={'100%'}
              sx={{ objectFit: 'contain' }}
              alt='course'
              src={getAbsolutePathFile(data.thumbnail) || common.course}
            />
          </Box>
        </Grid>
        <Grid item xs={8.5}>
          <Stack gap={0.5}>
            <Typography variant='body1' fontWeight={700}>
              {data.courseName}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                display: '-webkit-box',
                '-webkit-box-orient': 'vertical',
                ' -webkit-line-clamp': 3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {data.description}
            </Typography>
            <Flex gap={1}>
              {icons['instructor']}
              <Typography variant='caption' color={gray[500]}>
                {data.teacherInfo.fullName}
              </Typography>
            </Flex>
          </Stack>
        </Grid>
      </Grid>
    </Link>
  )
}
