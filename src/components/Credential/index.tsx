import React from 'react'
import { images } from '@/assets/images'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { primary } from '@/styles/theme'
import { styled } from '@mui/system'
import certificateImage from './icon-certificate.png'

const TriangleBottom = styled(Box)`
  position: absolute;
  bottom: -100px; /* Adjust the position as needed */
  transform: translateX(-50%);
  width: 0;
  left: 50%;
  height: 0;
  border-left: 150px solid transparent;
  border-right: 150px solid transparent;
  border-top: 100px solid ${primary[50]}; /* Adjust the color and height as needed */
  z-index: 10;
`

const Certificate = React.forwardRef<
  HTMLDivElement,
  { studentName: string; courseName: string; instructorName: string }
>((props, ref) => (
  <Box
    ref={ref}
    alignItems='center'
    justifyContent='center'
    border={3}
    borderColor='#ededed'
    width={1200}
    bgcolor='whitesmoke'
    fontFamily={'Times New Roman'}
    position='relative'
  >
    <Grid container spacing={4} height='100%'>
      <Grid item xs={8} height='100%'>
        <Stack gap={2} pl={4} height='100%' minHeight={600} justifyContent='center'>
          <Box component='img' src={certificateImage} width={100} height={100} />
          <Typography fontFamily={'Times new roman'} variant='body1' fontWeight={700}>
            April 18, 2024
          </Typography>
          <Typography fontFamily={'Times new roman'} variant='h2' fontWeight={700}>
            {props.studentName}
          </Typography>
          <Typography fontFamily={'Times new roman'} variant='body1' fontWeight={500}>
            Has successfully completed
          </Typography>
          <Typography fontFamily={'Times new roman'} variant='h1' fontWeight={700} lineHeight={1.3}>
            {props.courseName}
          </Typography>
          <Typography fontFamily={'Times new roman'} variant='body1' fontWeight={500}>
            an online non-credit course authorized by Brainstone
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Box
          height='70%'
          bgcolor={primary[50]}
          sx={{ filter: 'drop-shadow(0 0 0.1rem #313131)' }}
          borderColor='#ededed'
          position='absolute'
          width={300}
        >
          <Stack alignItems='center' justifyContent='space-around' height='100%' position='relative'>
            <Typography
              fontFamily={'Times new roman'}
              variant='h2'
              letterSpacing={3}
              textAlign='center'
              lineHeight={1.3}
              fontWeight={500}
            >
              COURSE CERTIFICATE
            </Typography>
            <Box component='img' src={images.logo} alt='certificate' height={100} width={100} />
            <TriangleBottom />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  </Box>
))

export default Certificate
