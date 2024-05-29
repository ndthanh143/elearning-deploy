import { Flex } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

export function InfoHeading() {
  const coursesInstance = courseKeys.list({ page: 1, size: 1 })
  const { data: courses } = useQuery({ ...coursesInstance })

  const infos = [
    {
      label: 'Total students',
      value: 100,
    },
    {
      label: 'Total courses',
      value: courses?.totalElements || 0,
    },
  ]
  return (
    <Grid container spacing={2}>
      <Grid item xs={5}>
        <Flex
          width='100%'
          borderRadius={3}
          border={1}
          borderColor='#e6e6e6'
          alignItems='start'
          height='100%'
          bgcolor='white'
        >
          {infos.map((item, index) => (
            <>
              {index > 0 && <Divider orientation='vertical' sx={{ height: '100%' }} />}
              <Box p={3} borderLeft={index > 0 ? 1 : 0} borderColor='#e6e6e6' flex={1}>
                <Typography variant='body1'>{item.label}</Typography>
                <Flex gap={1} mt={2}>
                  <Box width={6} height={6} borderRadius='100%' bgcolor='primary.main' />
                  <Typography variant='h2' fontWeight={700}>
                    {item.value}
                  </Typography>
                </Flex>
              </Box>
            </>
          ))}
        </Flex>
      </Grid>
      <Grid item xs={7}>
        <Flex
          width='100%'
          borderRadius={3}
          border={1}
          borderColor='#e6e6e6'
          height='100%'
          p={3}
          alignItems='start'
          bgcolor='white'
        >
          <Stack width='100%' gap={1}>
            <Typography variant='body1'>Overview</Typography>
            <Flex gap={2} justifyContent='space-between'>
              <Flex gap={1}>
                <Typography variant='h3' fontWeight={700}>
                  40
                </Typography>
                <Typography variant='body2'>Total</Typography>
              </Flex>
              <Flex gap={2}>
                <Flex gap={1}>
                  <Box width={6} height={6} borderRadius='100%' bgcolor='success.main' />
                  <Typography variant='h3' fontWeight={700}>
                    10
                  </Typography>
                  <Typography variant='body2'>Completed</Typography>
                </Flex>
                <Flex gap={1}>
                  <Box width={6} height={6} borderRadius='100%' bgcolor='secondary.light' />
                  <Typography variant='h3' fontWeight={700}>
                    30
                  </Typography>
                  <Typography variant='body2'>Inprogress</Typography>
                </Flex>
              </Flex>
            </Flex>
            <Flex width='100%' height={40}>
              <Box height='100%' width='40%' bgcolor='success.main' />
              <Box height='100%' width='60%' bgcolor='secondary.light' />
            </Flex>
          </Stack>
        </Flex>
      </Grid>
    </Grid>
  )
}
