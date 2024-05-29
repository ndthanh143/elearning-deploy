import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { Flex } from '@/components'
import { CheckOutlined, SchoolOutlined } from '@mui/icons-material'
import { gray } from '@/styles/theme'

export function Overview() {
  return (
    <Box width='100%'>
      <Typography fontWeight={700} mb={2}>
        Overview
      </Typography>
      <Flex gap={4} width='100%'>
        <Card variant='elevation' elevation={1} sx={{ flex: 1 }}>
          <CardContent>
            <Flex gap={2} alignItems='center'>
              <Box
                sx={{
                  border: 2,
                  borderRadius: '100%',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'primary.main',
                }}
              >
                <SchoolOutlined fontSize='large' color='primary' />
              </Box>
              <Stack>
                <Typography fontWeight={500} color={gray[700]}>
                  Total course
                </Typography>
                <Typography variant='h2' fontWeight={700}>
                  {0}
                </Typography>
              </Stack>
            </Flex>
          </CardContent>
        </Card>
        <Card variant='elevation' elevation={1} sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction='row' gap={2} alignItems='center'>
              <Box
                sx={{
                  border: 2,
                  borderRadius: '100%',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'success.main',
                }}
              >
                <CheckOutlined fontSize='large' color='success' />
              </Box>
              <Stack>
                <Typography fontWeight={500} color={gray[700]}>
                  Completed course
                </Typography>
                <Typography variant='h2' fontWeight={700}>
                  0
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Flex>
    </Box>
  )
}
