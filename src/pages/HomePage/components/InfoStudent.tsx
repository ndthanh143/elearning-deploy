import dayjs from 'dayjs'
import { useAuth } from '@/hooks'
import { ArrowForwardOutlined } from '@mui/icons-material'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'

export function InfoStudent() {
  const { profile } = useAuth()

  return (
    <Card sx={{ background: `linear-gradient(to right, ${blue[900]}, ${blue[600]})`, color: 'white', mt: 2 }}>
      <CardContent>
        <Typography variant='h5' fontWeight={700} my={2}>
          {`Welcome back, ${profile?.data.fullName}`}
        </Typography>
        <Typography variant='body2' marginBottom={3}>
          {`Take a look your learning progress for today, ${dayjs().format('MMMM DD YYYY')}`}
        </Typography>
        <Button variant='contained' color='secondary' sx={{ display: 'flex', gap: 1, bgcolor: 'secondary.dark' }}>
          Explore
          <ArrowForwardOutlined fontSize='small' />
        </Button>
      </CardContent>
    </Card>
  )
}
