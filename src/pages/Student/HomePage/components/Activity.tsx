import { Flex } from '@/components'
import { MoreHorizRounded, ShowChartOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'

export function Activity() {
  return (
    <Card variant='elevation' elevation={1}>
      <CardContent>
        <Flex justifyContent='space-between'>
          <Typography fontWeight={700}>Activity</Typography>
          <IconButton size='small'>
            <MoreHorizRounded />
          </IconButton>
        </Flex>
        <Box textAlign='center' mt={2}>
          <IconButton color='primary' sx={{ border: 2 }}>
            <ShowChartOutlined />
          </IconButton>
          <Typography my={2}>You didn't have any activity right now</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
