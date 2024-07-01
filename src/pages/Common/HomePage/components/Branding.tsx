import { Box, Container, Grid, Stack, Typography } from '@mui/material'

import { gray } from '@/styles/theme'
import { Flex, IconContainer, Link } from '@/components'
import { CustomButton } from './CustomButton'

import templateHumanImg from '@/assets/images/landingPage/template-human.png'
import { icons } from '@/assets/icons'
import { ReactNode } from 'react'

const HintCard = ({
  title,
  description,
  icon,
  color,
}: {
  title: string
  description: string
  icon: ReactNode
  color: 'primary' | 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'black'
}) => {
  return (
    <Flex
      gap={2}
      alignItems='center'
      bgcolor='rgba(255,255,255,0.8)'
      borderRadius={4}
      px={2}
      py={1}
      sx={{ backdropFilter: 'blur(4px)' }}
    >
      <IconContainer color={color} isActive>
        {icon}
      </IconContainer>
      <Stack gap={0}>
        <Typography variant='body1' fontWeight={700} color='#F48C06'>
          {title}
        </Typography>
        <Typography variant='body2' color={gray[700]} textAlign='center'>
          {description}
        </Typography>
      </Stack>
    </Flex>
  )
}

export function Branding() {
  return (
    <Stack position='relative' bgcolor='#fff3e4' overflow={'hidden'} pt={10}>
      <Container maxWidth='lg'>
        <Grid container>
          <Grid item xs={6}>
            <Stack gap={2} height='100%' justifyContent='center'>
              <Typography variant='h1' fontWeight={700} color='#F48C06' maxWidth={400} lineHeight={1.4}>
                <span style={{ color: '#F48C06' }}>Studying</span>{' '}
                <span style={{ color: '#2F327D' }}>Online is now much easier</span>
              </Typography>
              <Typography variant='body1' maxWidth={350} color={gray[700]} lineHeight={2}>
                Skilline is an interesting platform that will teach you in more an interactive way
              </Typography>
              <Flex>
                <Link href='/search'>
                  <CustomButton variant='contained' size='large'>
                    Join for free
                  </CustomButton>
                </Link>
              </Flex>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Flex justifyContent='center' position='relative' width='100%'>
              <Box component='img' src={templateHumanImg} width={400} height='auto' />
              <Box position='absolute' top={'20%'} left={20}>
                <HintCard title='250K' description='Assisted Student' icon={icons['calendar']} color='blue' />
              </Box>
              <Box position='absolute' top='50%' right={-20}>
                <HintCard
                  title='Congratulations'
                  description='Your admission completed'
                  icon={icons['assignment']}
                  color='red'
                />
              </Box>
              <Box position='absolute' bottom={'20%'} left={20}>
                <HintCard
                  title='Congratulations'
                  description='Your admission completed'
                  icon={icons['lecture']}
                  color='green'
                />
              </Box>
            </Flex>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  )
}
