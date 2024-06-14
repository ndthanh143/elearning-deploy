import { Flex } from '@/components'
import { gray, primary } from '@/styles/theme'
import { Box, Container, Divider, Stack, Typography } from '@mui/material'

export function Footer() {
  return (
    <Box bgcolor={primary[800]} pt={8} pb={2}>
      <Container maxWidth='sm'>
        <Stack gap={4}>
          <Flex gap={4} justifyContent={'center'}>
            <Box component='img' src={'/logo.ico'} width={80} height={80} />
            <Divider orientation='vertical' flexItem sx={{ bgcolor: gray[300] }} />
            <Typography variant='h3' color='white' fontWeight={400}>
              Online Learning
              <br />
              Platform
            </Typography>
          </Flex>
          <Typography textAlign='center' fontWeight={400} color='white'>
            © 2021 Class Technologies Inc.{' '}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
