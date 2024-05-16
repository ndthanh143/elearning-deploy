import { ShowChartOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'

export function Activity() {
  return (
    <Card variant='elevation' elevation={2}>
      <CardContent>
        <Typography variant='h6'>Activity</Typography>
        <Box textAlign='center'>
          <IconButton color='primary' sx={{ border: 2 }}>
            <ShowChartOutlined />
          </IconButton>
          <Typography my={2}>You didn't have any activity right now</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
