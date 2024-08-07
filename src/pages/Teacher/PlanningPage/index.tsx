import { useQuery } from '@tanstack/react-query'
import { Container, Grid, Stack, Typography } from '@mui/material'

import { useAuth } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'

import { AddPlanSection, PlanCard } from './components'
import { Flex, Loading, NoData } from '@/components'

export const PlanningPage = () => {
  const { profile } = useAuth()

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data, isFetched, isFetching } = useQuery({ ...lessonPlanInstance, enabled: !!profile?.data.id })

  return (
    <Container sx={{ my: 2 }}>
      <AddPlanSection />
      <Stack mt={4} gap={1}>
        <Typography variant='h3' fontWeight={600}>
          Your plans
        </Typography>
        {!data?.totalElements && isFetched && (
          <Stack alignItems='center' justifyContent='center' gap={1} pt={4}>
            <NoData title={`You haven't any plan, create your first plan to manage your courses`} />
          </Stack>
        )}
        <Grid container spacing={4}>
          {data?.content.map((plan) => (
            <Grid item xs={12} md={6} lg={3}>
              <PlanCard data={plan} />
            </Grid>
          ))}
        </Grid>
      </Stack>
      {isFetching && (
        <Flex justifyContent='center' height='40vh'>
          <Loading />
        </Flex>
      )}
    </Container>
  )
}
