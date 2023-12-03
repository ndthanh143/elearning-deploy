import { PageContentHeading } from '@/components'
import { Box, Grid } from '@mui/material'
import { ScheduleBoard, ScheduleList } from './containers'

export const SchedulePage = () => {
  return (
    <Box>
      <PageContentHeading />
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <ScheduleList />
        </Grid>
        <Grid item xs={8}>
          <ScheduleBoard />
        </Grid>
      </Grid>
    </Box>
  )
}
