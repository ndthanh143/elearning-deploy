import { useAuth } from '@/hooks'
import { gray } from '@/styles/theme'
import { Edit } from '@mui/icons-material'
import { Avatar, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'

export const ProfilePage = () => {
  const { profile } = useAuth()

  return (
    profile && (
      <Container>
        <Card>
          <CardContent>
            <Stack direction='row' gap={4} alignItems='center'>
              <Avatar src={profile.data.avatarPath} alt={profile.data.fullName} sx={{ width: 80, height: 80 }} />
              <Stack>
                <Typography fontWeight={500}>{profile.data.fullName}</Typography>
                <Typography color={gray[800]}>{profile.data.email}</Typography>
              </Stack>
              <Button color='primary' sx={{ display: 'flex', gap: 1 }}>
                <Edit />
                Edit Profile
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    )
  )
}
