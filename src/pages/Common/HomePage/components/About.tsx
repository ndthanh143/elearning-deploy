import { gray } from '@/styles/theme'
import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import { CustomButton } from './CustomButton'
import { useNavigate } from 'react-router-dom'
import { Flex } from '@/components'
import { blue } from '@mui/material/colors'

const Card = ({ title, buttonTitle, href }: { title: string; buttonTitle: string; href: string }) => {
  const navigate = useNavigate()

  const redirect = (href: string) => () => navigate(href)

  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      borderRadius={4}
      sx={{
        backgroundImage:
          'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnRTNbKyPtWFMNn2T9HdUR3wO-42vE300_Gg&s)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      position='relative'
      overflow={'hidden'}
      height={250}
    >
      <Box position={'absolute'} sx={{ width: '100%', height: '100%', bgcolor: 'rgba(0, 0, 0, 0.3)' }} />
      <Stack gap={2} py={'auto'} zIndex={10}>
        <Typography variant='h3' textTransform='uppercase' color='#fff' fontWeight={700}>
          {title}
        </Typography>
        <CustomButton
          variant='outlined'
          size='large'
          sx={{
            borderColor: 'white',
            color: 'white',
            ':hover': {
              bgcolor: blue[500],
              borderColor: blue[500],
            },
          }}
          onClick={redirect(href)}
        >
          {buttonTitle}
        </CustomButton>
      </Stack>
    </Flex>
  )
}

const cardProps = [
  {
    title: 'For instructors',
    buttonTitle: 'Start a class today',
    href: '/login',
  },
  {
    title: 'For students',
    buttonTitle: 'Enter access code',
    href: '/login',
  },
]

export function About() {
  return (
    <Container maxWidth='md' sx={{ py: 8 }}>
      <Typography variant='h2' fontWeight={700} textAlign='center'>
        <span style={{ color: '#2F327D' }}>What is</span> <span style={{ color: '#F48C06' }}>Brainstone?</span>
      </Typography>
      <Typography color={gray[500]} textAlign='center' pt={2}>
        Brainstone is a platform that allows educators to create online classes whereby they can store the course
        materials online; manage assignments, quizzes and exams; monitor due dates; grade results and provide students
        with feedback all in one place.
      </Typography>
      <Grid container spacing={8} pt={6}>
        {cardProps.map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card {...card} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
