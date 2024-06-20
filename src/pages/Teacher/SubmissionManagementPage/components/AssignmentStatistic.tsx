import { Submission } from '@/services/assignmentSubmission/assignmentSubmission.dto'
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale, ChartOptions } from 'chart.js'
import { Flex, NoData } from '@/components'

ChartJS.register(CategoryScale)

interface IAssignmentStatisticProps {
  data?: Submission[]
}

export const AssignmentStatistic = ({ data = [] }: IAssignmentStatisticProps) => {
  const processData = (data: Submission[]) => {
    const ranges = Array.from({ length: 10 }, (_, i) => ({ min: i, max: i + 1, count: 0 }))

    let totalCount = 0
    let greaterThanFiveCount = 0

    data.forEach((item) => {
      const { score } = item
      if (score) {
        const range = ranges.find((range) => score >= range.min && score <= range.max)
        if (range) {
          range.count += 1
          totalCount += 1

          if (score > 5) {
            greaterThanFiveCount += 1
          }
        }
      }
    })

    const labels = ranges.map((range) => `${range.min}-${range.max}`)
    const counts = ranges.map((range) => range.count)

    const greaterThanFivePercentage = (greaterThanFiveCount / totalCount) * 100

    return { labels, counts, greaterThanFivePercentage }
  }

  const processDataDoughnut = (data: Submission[]) => {
    let greaterThanFiveCount = 0
    let lessThanOrEqualFiveCount = 0
    let totalCount = data.length

    data.forEach((item) => {
      const { score } = item
      if (score) {
        if (score > 5) {
          greaterThanFiveCount += 1
        } else {
          lessThanOrEqualFiveCount += 1
        }
      }
    })

    const greaterThanFivePercentage = (greaterThanFiveCount / totalCount) * 100
    const lessThanOrEqualFivePercentage = (lessThanOrEqualFiveCount / totalCount) * 100

    return {
      labels: ['Greater than 5', 'Less than or equal to 5'],
      percentages: [greaterThanFivePercentage, lessThanOrEqualFivePercentage],
    }
  }

  const { labels, counts } = processData(data)

  const { labels: labelsDoughnut, percentages } = processDataDoughnut(data)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'students',
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,1)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: counts,
        borderRadius: 12,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        borderWidth: 1,
        borderColor: '#ddd',
      },
    },
  }

  const chartDataDoughnut = {
    labels: labelsDoughnut,
    datasets: [
      {
        data: percentages,
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
        hoverBackgroundColor: ['rgba(75,192,192,0.8)', 'rgba(255,99,132,0.8)'],
      },
    ],
  }

  const doughnutOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        borderWidth: 1,
        borderColor: '#ddd',
      },
    },
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Card sx={{ height: '100%' }} elevation={0}>
          <CardContent sx={{ height: '100%' }}>
            <Flex mb={2}>
              <Typography fontWeight={700} variant='body2'>
                Overview
              </Typography>
            </Flex>
            {data.length > 0 ? (
              <Stack gap={2}>
                <Doughnut data={chartDataDoughnut} options={doughnutOptions} />
                <Stack gap={0.5} alignItems='center'>
                  <Flex gap={1}>
                    <Box width={30} height={15} borderRadius={4} bgcolor='rgba(75,192,192,0.6)' />
                    <Typography fontWeight={600} variant='body2'>
                      Greater than 5
                    </Typography>
                  </Flex>
                  <Flex gap={1}>
                    <Box width={30} height={15} borderRadius={4} bgcolor='rgba(255,99,132,0.6)' />
                    <Typography fontWeight={600} variant='body2'>
                      Less than 5
                    </Typography>
                  </Flex>
                </Stack>
              </Stack>
            ) : (
              <NoData />
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={8}>
        <Card sx={{ height: '100%' }} elevation={0}>
          <CardContent sx={{ height: '100%' }}>
            <Flex mb={2}>
              <Typography fontWeight={700} variant='body2'>
                Points statistics
              </Typography>
            </Flex>
            <Stack gap={2}>
              <Bar data={chartData} options={options} />
              <Flex gap={1}>
                <Box width={30} height={15} borderRadius={4} bgcolor='rgba(75,192,192,0.6)' />
                <Typography fontWeight={600} variant='body2'>
                  Total student
                </Typography>
              </Flex>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
