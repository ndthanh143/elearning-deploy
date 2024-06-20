import { Flex } from '@/components'
import { MoreHorizRounded, ShowChartOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'

export function Activity() {
  const mockData = [
    {
      day: 'Monday',
      totalHours: 5,
    },
    {
      day: 'Tuesday',
      totalHours: 7,
    },
    {
      day: 'Wednesday',
      totalHours: 3,
    },
    {
      day: 'Thursday',
      totalHours: 8,
    },
    {
      day: 'Friday',
      totalHours: 2,
    },
    {
      day: 'Saturday',
      totalHours: 6,
    },
    {
      day: 'Sunday',
      totalHours: 10,
    },
  ]

  const data: ChartData<'bar'> = {
    labels: mockData.map((item) => item.day),
    datasets: [
      {
        label: 'Total hours',
        data: mockData.map((item) => item.totalHours),
        backgroundColor: 'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 },
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: false,
      },
    },
  }

  const isNodata = mockData.every((item) => item.totalHours === 0)

  return (
    <Card variant='elevation' elevation={1}>
      <CardContent>
        <Flex justifyContent='space-between'>
          <Typography fontWeight={700}>Activity</Typography>
          <IconButton size='small'>
            <MoreHorizRounded />
          </IconButton>
        </Flex>
        {isNodata ? (
          <Box textAlign='center' mt={2}>
            <IconButton color='primary' sx={{ border: 2 }}>
              <ShowChartOutlined />
            </IconButton>
            <Typography my={2}>You didn't have any activity right now</Typography>
          </Box>
        ) : (
          <Box mt={2}>
            <Bar data={data} options={options} />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
