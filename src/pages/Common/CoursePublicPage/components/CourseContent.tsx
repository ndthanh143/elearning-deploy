import { Course } from '@/services/course/course.dto'
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { Check, FiberManualRecord } from '@mui/icons-material'
import { NoData } from '@/components'

export function CourseContent({ data }: { data: Course }) {
  return (
    <Stack gap={4}>
      <Card variant='outlined'>
        <CardContent>
          <Stack gap={3}>
            <Typography variant='h6'>What you'll learn</Typography>
            {data.objectives ? (
              <Grid container spacing={2}>
                {data.objectives.map((objective) => (
                  <Grid item xs={12} lg={6} key={objective}>
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
          </Stack>
        </CardContent>
      </Card>
      <Card variant='outlined'>
        <CardContent>
          <Stack gap={2}>
            <Typography variant='h6'>Requirements</Typography>
            {data.requirements.map((requirement) => (
              <Box display='flex' gap={2} alignItems='center' key={requirement}>
                <FiberManualRecord fontSize='small' color='primary' />
                <Typography>{requirement}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
      <Card variant='outlined'>
        <CardContent>
          <Stack gap={2}>
            <Typography variant='h6'>Descriptions</Typography>
            <Typography>{data.description}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
