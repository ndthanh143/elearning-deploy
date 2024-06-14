import { gray } from '@/styles/theme'
import { Box, Container, Grid, Stack, Typography } from '@mui/material'

import featureImage1 from '@/assets/images/landingPage/feature-img-1.png'
import featureImage2 from '@/assets/images/landingPage/feature-img-2.png'
import featureImage3 from '@/assets/images/landingPage/feature-img-3.png'

import { Flex } from '@/components'

export function Features() {
  return (
    <Container maxWidth='lg' sx={{ my: 8 }}>
      <Stack mb={12}>
        <Typography textAlign='center' variant='h2' fontWeight={700}>
          <span style={{ color: '#2F327D' }}>Our</span> <span style={{ color: '#F48C06' }}>Features</span>
        </Typography>
        <Typography textAlign={'center'} color={gray[500]}>
          This very extraordinary feature, can make learning activities more efficient
        </Typography>
      </Stack>
      <Stack gap={16}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Stack justifyContent='center' height='100%'>
              <Typography variant='h2' fontWeight={700} maxWidth={300} lineHeight={1.5}>
                <span style={{ color: '#F48C06' }}>Tools</span>{' '}
                <span style={{ color: '#2F327D' }}>For Teachers And Learners</span>
              </Typography>
              <Typography variant='body2' color={gray[500]} mt={2} maxWidth={350} lineHeight={1.5}>
                Class has a dynamic set of teaching tools built to be deployed and used during class. Teachers can
                handout assignments in real-time for students to complete and submit.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Flex justifyContent='end' width='100%'>
              <Box component='img' src={featureImage1} maxWidth={600} />
            </Flex>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={5}>
            <Flex justifyContent='start'>
              <Box component='img' src={featureImage2} maxWidth={400} />
            </Flex>
          </Grid>
          <Grid item xs={7}>
            <Stack justifyContent='center' height='100%' alignItems='center'>
              <Box>
                <Typography variant='h2' fontWeight={700} maxWidth={300} lineHeight={1.5}>
                  <span style={{ color: '#2F327D' }}>Assessments,</span>{' '}
                  <span style={{ color: '#F48C06' }}>Quizzes,</span> <span style={{ color: '#2F327D' }}>Tasks</span>
                </Typography>
                <Typography variant='body2' color={gray[500]} mt={2} maxWidth={350} lineHeight={1.5}>
                  Class has a dynamic set of teaching tools built to be deployed and used during class. Teachers can
                  handout assignments in real-time for students to complete and submit.
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Stack justifyContent='center' height='100%'>
              <Typography variant='h2' fontWeight={700} maxWidth={300} lineHeight={1.5}>
                <span style={{ color: '#F48C06' }}>Class Management</span>{' '}
                <span style={{ color: '#2F327D' }}>Tools for Educators</span>
              </Typography>
              <Typography variant='body2' color={gray[500]} mt={2} maxWidth={350} lineHeight={1.5}>
                Class provides tools to help run and manage the class such as Class Roster, Attendance, and more. With
                the Gradebook, teachers can review and grade tests and quizzes in real-time.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Flex justifyContent='end' width='100%'>
              <Box component='img' src={featureImage3} maxWidth={600} />
            </Flex>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  )
}
