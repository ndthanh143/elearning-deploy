import { useQuery } from '@tanstack/react-query'
import { Container, Grid, Stack, Typography } from '@mui/material'

import { useAuth } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'

import { AddPlanSection, PlanCard } from './components'

export const PlanningPage = () => {
  const { profile } = useAuth()

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data } = useQuery({ ...lessonPlanInstance, enabled: !!profile?.data.id })

  return (
    <Container sx={{ my: 2 }}>
      <AddPlanSection />
      <Stack mt={4} gap={1}>
        <Typography variant='h3' fontWeight={700}>
          Your plans
        </Typography>
        <Grid container spacing={4}>
          {data?.content.map((plan) => (
            <Grid item xs={3}>
              <PlanCard data={plan} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
}
