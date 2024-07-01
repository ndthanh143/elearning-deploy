import { Flex } from '@/components'
import { gray } from '@/styles/theme'
import { CalendarMonthRounded } from '@mui/icons-material'
import { Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

const ItemCard = ({
  title,
  description,
  color,
  icon,
}: {
  title: string
  description: string
  icon: ReactNode
  color: string
}) => {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Flex alignItems='center' flex={1} justifyContent='center' pb={4} pt={8}>
          <Typography variant='h3' color='#2F327D' fontWeight={500} textAlign='center' lineHeight={1.2}>
            {title}
          </Typography>
        </Flex>
        <Typography variant='body2' color={gray[500]} textAlign='center' mt={'auto'}>
          {description}
        </Typography>
      </CardContent>
      <Flex
        position={'absolute'}
        top={-25}
        height={50}
        width={50}
        left={'50%'}
        sx={{ transform: 'translateX(-50%)' }}
        bgcolor={color}
        borderRadius={'100%'}
        justifyContent={'center'}
      >
        {icon}
      </Flex>
    </Card>
  )
}

const cardProps = [
  {
    title: 'Online Billing, Invoicing, & Contracts',
    description:
      'Simple and secure control of your organization’s financial and legal transactions. Send customized invoices and contracts',
    icon: <CalendarMonthRounded color='primary' />,
    color: 'green',
  },
  {
    title: 'Easy Scheduling & Attendance Tracking',
    description:
      'Schedule and reserve classrooms at one campus or multiple campuses. Keep detailed records of student attendance',
    icon: <CalendarMonthRounded color='primary' />,
    color: 'orange',
  },
  {
    title: 'Customer Tracking',
    description:
      'Automate and track emails to individuals or groups. Skilline’s built-in system helps organize your organization ',
    icon: <CalendarMonthRounded color='primary' />,
    color: 'blue',
  },
]

export function OutStanding() {
  return (
    <Container maxWidth='lg' sx={{ my: 2 }}>
      <Stack gap={8}>
        <Stack alignItems='center'>
          <Typography variant='h2' fontWeight={700} textAlign='center'>
            <span style={{ color: '#2F327D' }}>All-In-One</span>{' '}
            <span style={{ color: '#F48C06' }}>Cloud Software.</span>
          </Typography>
          <Typography variant='body1' color={gray[500]} textAlign='center' maxWidth={600}>
            Skilline is one powerful online software suite that combines all the tools needed to run a successful school
            or office.
          </Typography>
        </Stack>
        <Grid container spacing={4} width='100%'>
          {cardProps.map((card, index) => (
            <Grid item xs={12} lg={4} key={index}>
              <ItemCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
}
