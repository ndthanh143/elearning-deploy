import { CustomModal } from '@/components'
import type { QuizSubmission } from '@/services/quizSubmission/dto'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Card, CardContent, Grid, Typography } from '@mui/material'

ChartJS.register(CategoryScale)

interface IModalQuizStatisticProps {
  isOpen: boolean
  onClose: () => void
  data: QuizSubmission[]
}
export const ModalQuizStatistic = ({ isOpen, onClose, data }: IModalQuizStatisticProps) => {
  const processData = (data: QuizSubmission[]) => {
    const ranges = Array.from({ length: 10 }, (_, i) => ({ min: i, max: i + 1, count: 0 }))

    let totalCount = 0
    let greaterThanFiveCount = 0

    data.forEach((item) => {
      const { score } = item
      const range = ranges.find((range) => score >= range.min && score <= range.max)
      if (range) {
        range.count += 1
        totalCount += 1

        if (score > 5) {
          greaterThanFiveCount += 1
        }
      }
    })

    const labels = ranges.map((range) => `${range.min}-${range.max}`)
    const counts = ranges.map((range) => range.count)

    const greaterThanFivePercentage = (greaterThanFiveCount / totalCount) * 100

    return { labels, counts, greaterThanFivePercentage }
  }

  const processDataDougnut = (data: QuizSubmission[]) => {
    let greaterThanFiveCount = 0
    let lessThanOrEqualFiveCount = 0
    let totalCount = data.length

    data.forEach((item) => {
      const { score } = item
      if (score > 5) {
        greaterThanFiveCount += 1
      } else {
        lessThanOrEqualFiveCount += 1
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
        title: {
          display: true,
          text: 'Number of Students',
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
    <CustomModal title='Quiz statistic' isOpen={isOpen} onClose={onClose}>
      <Card sx={{ width: 'fit-content', mt: 2 }}>
        <CardContent sx={{ display: 'flex', gap: 1 }}>
          Total Submission: <Typography fontWeight={500}>{data.length} students</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={8} mb={2}>
        <Grid item xs={8}>
          <Bar data={chartData} options={options} />
        </Grid>
        <Grid item xs={4}>
          <Doughnut data={chartDataDoughnut} />
        </Grid>
      </Grid>
    </CustomModal>
  )
}
