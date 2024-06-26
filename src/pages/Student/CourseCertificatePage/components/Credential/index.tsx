import React from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import certificateImage from './icon-certificate.png'

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
    width='100%'
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
    </Grid>
  </Box>
))

export default Certificate
