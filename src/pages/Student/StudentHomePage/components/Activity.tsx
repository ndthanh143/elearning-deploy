import { Flex } from '@/components'
import { activityKeys } from '@/services/activity/query'
import { MoreHorizRounded, ShowChartOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ChartData, ChartOptions } from 'chart.js'
import dayjs from 'dayjs'
import { Bar } from 'react-chartjs-2'

export function Activity() {
  const fromDate = dayjs().startOf('week').toISOString()
  const toDate = dayjs().endOf('week').toISOString()

  const activityInstance = activityKeys.myActivity({ fromDate, toDate })
  const { data: activityData } = useQuery({ ...activityInstance })

  const mappingData =
    activityData?.reduce(
      (acc, item) => {
        const day = dayjs(item.day).format('dddd')
        const totalHours = item.totalHours
        const index = acc.findIndex((accItem) => accItem.day === day)
        if (index !== -1) {
          acc[index].totalHours = totalHours
        }
        return acc
      },
      [
        {
          day: 'Monday',
          totalHours: 0,
        },
        {
          day: 'Tuesday',
          totalHours: 0,
        },
        {
          day: 'Wednesday',
          totalHours: 0,
        },
        {
          day: 'Thursday',
          totalHours: 0,
        },
        {
          day: 'Friday',
          totalHours: 0,
        },
        {
          day: 'Saturday',
          totalHours: 0,
        },
        {
          day: 'Sunday',
          totalHours: 0,
        },
      ],
    ) || []

  const data: ChartData<'bar'> = {
    labels: mappingData.map((item) => item.day),
    datasets: [
      {
        label: 'Total hours',
        data: mappingData.map((item) => item.totalHours),
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

  const isNodata = mappingData.every((item) => item.totalHours === 0)

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
