import { Box, Button, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth='lg'>
      <Box
        textAlign='center'
        height='100vh'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Box maxWidth={500}>
          <Typography variant='h5' fontWeight={700}>
            Sorry, Page Not Found!
          </Typography>
          <Typography my={2}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>
        </Box>
        <Box component='img' src='/404.jpg' maxWidth={300} />
        <Button onClick={() => navigate('/')} variant='contained' sx={{ width: 'fit-content', my: 5 }}>
          Go to Home
        </Button>
      </Box>
    </Container>
  )
}
