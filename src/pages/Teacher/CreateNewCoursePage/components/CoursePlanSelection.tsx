import { useAuth } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { CreateCourseForm, PlanCard } from '.'
import { Flex } from '@/components'
import { ArrowRightAltOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface ICoursePlanSelectionProps {
  onNext: () => void
  form: CreateCourseForm
}

export function CoursePlanSelection({ onNext, form }: ICoursePlanSelectionProps) {
  const { profile } = useAuth()

  const navigate = useNavigate()

  const { setValue, watch } = form

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data: lessonPlans } = useQuery({
    ...lessonPlanInstance,
    enabled: !!profile?.data.id,
  })

  const handleNavigatePlanningPage = () => {
    navigate('/planning')
  }

  return (
    <Stack gap={4}>
      <Typography textAlign='center' variant='h4'>
        Apply plan to your course
      </Typography>
      <Flex justifyContent='end'>
        <Button variant='outlined' sx={{ width: 'fit-content' }} onClick={handleNavigatePlanningPage}>
          Create New Plan
        </Button>
      </Flex>
      <Grid container spacing={2}>
        {lessonPlans?.content.map((plan) => (
          <Grid item xs={4}>
            <Box
              onClick={() => setValue('lessonPlanId', plan.id)}
              border='4px solid'
              borderColor={watch('lessonPlanId') === plan.id ? 'primary.main' : 'transparent'}
              borderRadius={6}
              p={1}
              sx={{ transition: 'all ease-in-out 0.2s' }}
            >
              <PlanCard data={plan} key={plan.id} />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Stack gap={2} alignItems='center'>
        <Typography textAlign='center' variant='h5'>
          OR
        </Typography>
      </Stack>
      <Divider />
      <Flex justifyContent='end'>
        <Button variant='text' sx={{ width: 'fit-content', display: 'flex', gap: 1 }} onClick={onNext}>
          Next step
          <ArrowRightAltOutlined />
        </Button>
      </Flex>
    </Stack>
  )
}
