import { Submission } from '@/services/assignmentSubmission/assignmentSubmission.dto'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
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

  const processDataDougnut = (data: Submission[]) => {
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

  const { labels: labelsDougnut, percentages } = processDataDougnut(data)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'students',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: counts,
      },
    ],
  }

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score Range',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,
          max: 100,
          stepSize: 1,
        },
      },
    },
  }

  const chartDataDoughnut = {
    labels: labelsDougnut,
    datasets: [
      {
        data: percentages,
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
        hoverBackgroundColor: ['rgba(75,192,192,0.8)', 'rgba(255,99,132,0.8)'],
      },
    ],
  }

  return (
    <Stack gap={4}>
      <Card>
        <CardContent>
          <Flex mb={1}>
            <Typography fontWeight={700} variant='body2'>
              Overview
            </Typography>
          </Flex>
          {data.length > 0 ? <Doughnut data={chartDataDoughnut} /> : <NoData />}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Flex mb={1}>
            <Typography fontWeight={700} variant='body2'>
              Points statistics
            </Typography>
          </Flex>
          <Bar data={chartData} options={options} />
        </CardContent>
      </Card>
    </Stack>
  )
}
