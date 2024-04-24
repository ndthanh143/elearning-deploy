import { useAuth } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { PlanCard } from '.'
import Slider, { Settings } from 'react-slick'
import { useState } from 'react'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { Flex } from '@/components'
import { ArrowRightAltOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { CreateCourseForm } from '..'

interface ICoursePlanSelectionProps {
  onNext: () => void
  form: CreateCourseForm
}

export function CoursePlanSelection({ onNext, form }: ICoursePlanSelectionProps) {
  const { profile } = useAuth()

  const navigate = useNavigate()

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data: lessonPlans } = useQuery({
    ...lessonPlanInstance,
    enabled: !!profile?.data.id,
  })

  const [selectedPlan, setSelectedPlan] = useState<LessonPlan>()

  const sliderSettings: Settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: true,
    dots: true,
    focusOnSelect: true,
  }

  const handleNavigatePlanningPage = () => {
    navigate('/planning')
  }

  return (
    <Stack gap={4}>
      <Typography textAlign='center' variant='h4'>
        Apply plan to your course
      </Typography>
      <Slider {...sliderSettings}>
        {lessonPlans?.content.map((plan) => (
          <Box mx={-2} px={2}>
            <Box
              onClick={() => setSelectedPlan(plan)}
              border='4px solid'
              borderColor={selectedPlan?.id === plan.id ? 'primary.main' : 'transparent'}
              borderRadius={6}
              p={1}
              sx={{ transition: 'all ease-in-out 0.2s' }}
            >
              <PlanCard data={plan} key={plan.id} />
            </Box>
          </Box>
        ))}
      </Slider>
      <Stack gap={2} alignItems='center'>
        <Typography textAlign='center' variant='h5'>
          OR
        </Typography>
        <Button variant='outlined' sx={{ width: 'fit-content' }} onClick={handleNavigatePlanningPage}>
          Create New Plan
        </Button>
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
