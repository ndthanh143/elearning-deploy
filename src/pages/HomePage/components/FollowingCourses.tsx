import { CourseCard, Flex, NoData } from '@/components'
import { CourseRegistration } from '@/services/coursesRegistration/coursesRegistration.dto'
import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material'

interface IFollowingCoursesProps {
  courses: CourseRegistration[]
}

export function FollowingCourses({ courses }: IFollowingCoursesProps) {
  return (
    <Card variant='elevation' elevation={2}>
      <CardContent>
        <Box display='flex' justifyContent='space-between' my={1}>
          <Typography variant='h6'>Following Course</Typography>
          {courses.length > 0 && (
            <Flex gap={2}>
              <IconButton sx={{ border: 1 }} size='small'>
                <ArrowBackOutlined fontSize='small' />
              </IconButton>
              <IconButton sx={{ border: 1 }} size='small'>
                <ArrowForwardOutlined fontSize='small' />
              </IconButton>
            </Flex>
          )}
        </Box>

        <Grid container spacing={3} mt={1}>
          {courses.map((course) => (
            <Grid item xs={4}>
              <CourseCard key={course.id} data={course.courseInfo} />
            </Grid>
          ))}
          {courses.length === 0 && (
            <Grid item xs={12}>
              <Stack gap={1}>
                <NoData title="You don't have any course yet!" />
                <Button sx={{ display: 'flex', gap: 1, width: 'fit-content', mx: 'auto' }}>
                  Explore new course <ArrowForwardOutlined fontSize='small' />
                </Button>
              </Stack>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}
