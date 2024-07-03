import { CourseCard, Link, NoData } from '@/components'
import { useAuth } from '@/hooks'
import { courseKeys } from '@/services/course/course.query'
import { ArrowForwardOutlined } from '@mui/icons-material'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 3
export function FollowingCourses() {
  const { profile } = useAuth()

  const coursesInstance = courseKeys.myCourse({
    page: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
  })
  const { data: courses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile),
    select: (data) => data.content,
  })

  return (
    <Stack>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography fontWeight={700}>Following courses</Typography>
        {!!courses?.length && (
          <Link fontWeight={700} href='/courses' sx={{ textDecoration: 'none', color: 'primary.main' }}>
            View more
          </Link>
        )}
      </Box>

      <Grid container spacing={2}>
        {courses?.map((course) => (
          <Grid item xs={12} lg={4} key={course.id}>
            <CourseCard data={course} />
          </Grid>
        ))}
      </Grid>

      {courses?.length === 0 && (
        <Stack gap={1} width='100%'>
          <NoData title="You don't have any course yet!" />
          <Button sx={{ display: 'flex', gap: 1, width: 'fit-content', mx: 'auto' }}>
            Explore new course <ArrowForwardOutlined fontSize='small' />
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
