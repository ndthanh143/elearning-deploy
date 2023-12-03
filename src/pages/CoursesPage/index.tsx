import { Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '@/hooks'
import { coursesRegistrationKeys } from '@/services/coursesRegistration/coursesRegistration.query'
import { BoxContent, CourseCard, PageContentHeading } from '@/components'
import { ScheduleItem } from '../SchedulePage/components'

const DEFAULT_PAGE_SIZE = 10
export const CoursesPage = () => {
  const { profile } = useAuth()

  const [page, setPage] = useState(0)

  const coursesInstance = coursesRegistrationKeys.list({
    studentId: Number(profile?.data.id),
    page,
    size: DEFAULT_PAGE_SIZE,
  })
  const { data: courses, isFetching } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile),
  })

  const handleLoadmore = () => setPage((prev) => prev + 1)

  return (
    <Box>
      <PageContentHeading />

      <Grid container spacing={4}>
        <Grid item xs={8}>
          <BoxContent>
            <Box display='flex' justifyContent='space-between' my={1}>
              <Typography variant='h6'>All courses</Typography>
            </Box>

            {isFetching && (
              <Box p={2}>
                <Skeleton height={250} sx={{ borderRadius: 3 }} />
              </Box>
            )}
            {courses && (
              <>
                {courses.content.map((course) => (
                  <CourseCard key={course.id} data={course.courseInfo} />
                ))}
                {courses.pageIndex + 1 < courses?.totalPages && (
                  <Button variant='outlined' sx={{ mx: 'auto', mt: 2, display: 'block' }} onClick={handleLoadmore}>
                    Load more
                  </Button>
                )}
              </>
            )}
          </BoxContent>
        </Grid>
        <Grid item xs={4}>
          <Stack gap={3}>
            <BoxContent>
              {/* <Typography variant='h5'></Typography> */}
              <ScheduleItem />
            </BoxContent>
            <BoxContent>
              {/* <Typography variant='h5'></Typography> */}
              <ScheduleItem />
            </BoxContent>
            <BoxContent>
              {/* <Typography variant='h5'></Typography> */}
              <ScheduleItem />
            </BoxContent>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
