import { useAuth } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { CreateCourseForm } from '.'
import { NoData } from '@/components'
import { useNavigate } from 'react-router-dom'
import { AddOutlined } from '@mui/icons-material'
import { PlanCard } from '@/pages/Teacher/PlanningPage/components'

interface ICoursePlanSelectionProps {
  onNext?: () => void
  form: CreateCourseForm
}

export function CoursePlanSelection({ form }: ICoursePlanSelectionProps) {
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
    <Stack gap={2} width='100%'>
      <Box>
        <Typography variant='h3' fontWeight={700}>
          Select Lesson Plan
        </Typography>
        <Typography variant='body2'>
          You can apply a lesson plan to your course, this will help you to manage your course better
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {lessonPlans?.content.map((plan) => (
          <Grid item xs={12} md={6} lg={4}>
            <Box
              onClick={() => setValue('lessonPlanId', plan.id)}
              border='4px solid'
              borderColor={watch('lessonPlanId') === plan.id ? 'primary.main' : 'transparent'}
              borderRadius={6}
              p={1}
              height='100%'
              sx={{ transition: 'all ease-in-out 0.1s' }}
            >
              <PlanCard data={plan} key={plan.id} viewOnly />
            </Box>
          </Grid>
        ))}
      </Grid>
      {lessonPlans?.content.length === 0 && (
        <Stack width='100%' alignItems='center' justifyContent='center' gap={1}>
          <NoData title='You dont have any plan yet!' />
          <Button onClick={handleNavigatePlanningPage} startIcon={<AddOutlined />}>
            Create new plan
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
