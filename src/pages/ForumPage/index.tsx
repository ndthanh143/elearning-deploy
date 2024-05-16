import { Container, Grid, Typography } from '@mui/material'
import { useAuth } from '@/hooks'
import { useQuery } from '@tanstack/react-query'
import { forumKeys } from '@/services/forum/forum.query'
import { ForumCard } from './components'

export const ForumPage = () => {
  const { profile } = useAuth()

  const forumsInstance = forumKeys.list({ accountId: Number(profile?.data.id) })
  const { data: forums } = useQuery({ ...forumsInstance, enabled: Boolean(profile) })

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant='h4' fontWeight={500}>
        Your forums
      </Typography>
      <Grid container spacing={4} mt={1}>
        {forums &&
          forums.content.map((forum) => (
            <Grid item xs={3}>
              <ForumCard data={forum} />
            </Grid>
          ))}
      </Grid>
    </Container>
  )
}
