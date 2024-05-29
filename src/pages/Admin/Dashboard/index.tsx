import { RoleEnum } from '@/services/auth/auth.dto'
import { userKeys } from '@/services/user/user.query'
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { BoxContent } from '@/components'

ChartJS.register(CategoryScale)

const Chart = () => {
  // Example data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Total users',
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.8)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [65, 59, 80, 81, 56],
      },
    ],
  }

  // Chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div>
      <h2>Summary users</h2>
      <Bar data={data} options={options} />
    </div>
  )
}

const DoughnutChart = () => {
  // Example data
  const data = {
    labels: ['Students', 'Teachers'],
    datasets: [
      {
        data: [70, 30], // Example percentages (adjust based on your actual data)
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
        hoverBackgroundColor: ['rgba(75,192,192,0.8)', 'rgba(255,99,132,0.8)'],
      },
    ],
  }

  return (
    <div>
      <h2>Summary of role</h2>
      <Doughnut data={data} />
    </div>
  )
}

export function Dashboard() {
  const userInstance = userKeys.fullList({})
  const { data: users } = useQuery(userInstance)

  const teacherCount = users?.content.filter((user) => user.role === RoleEnum.Teacher).length
  const studentCount = users?.content.filter((user) => user.role === RoleEnum.Student).length

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Stack gap={1}>
              <Typography>Student</Typography>
              <Typography variant='h5'>{studentCount} student</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Stack gap={1}>
              <Typography>Teacher</Typography>
              <Typography variant='h5'>{teacherCount} teachers</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={8}>
        <BoxContent p={4} minHeight='60vh'>
          <Chart />
        </BoxContent>
      </Grid>
      <Grid item xs={4}>
        <BoxContent p={4} minHeight='60vh'>
          <DoughnutChart />
        </BoxContent>
      </Grid>
    </Grid>
  )
}
