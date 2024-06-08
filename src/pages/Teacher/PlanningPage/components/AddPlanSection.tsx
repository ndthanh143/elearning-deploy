import { Box, Button, Stack, Typography } from '@mui/material'
import { AddOutlined } from '@mui/icons-material'

import mindMapIcon from '@/assets/images/planingPage/mindmap.png'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'
import { useAlert, useAuth } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { icons } from '@/assets/icons'

export function AddPlanSection() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const { triggerAlert } = useAlert()
  const navigate = useNavigate()

  const planType = {
    mindMap: {
      icon: icons['planMindmap'],
      title: 'Mind Map',
      type: 'mindmap',
    },
    basic: {
      icon: icons['planBasic'],
      title: 'Basic',
      type: 'basic',
    },
  }

  const { mutate: mutateCreateLessonPlan } = useMutation({
    mutationFn: lessonPlanService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      triggerAlert('Create new plan successfully', 'success')
      navigate(`/planning/${data.id}`)
    },
    onError: () => {
      triggerAlert('Faild to create lesson plan', 'error')
    },
  })

  const handleCreateSamplePlan = (type: 'mindmap' | 'basic') => () => {
    mutateCreateLessonPlan({
      teacherId: profile?.data.id as number,
      type,
      name: 'Sample Plan',
    })
  }

  return (
    <>
      <Stack direction='row' gap={2}>
        <Button variant='contained' color='primary' sx={{ borderRadius: 4, paddingX: 6, paddingY: 2 }}>
          <AddOutlined fontSize='large' />
        </Button>
        {Object.values(planType).map((value) => (
          <Button
            variant='outlined'
            sx={{
              width: 140,
              height: 120,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              color: 'black',
            }}
            onClick={handleCreateSamplePlan(value.type as 'mindmap' | 'basic')}
          >
            <Box width={30} height={30}>
              {value.icon}
            </Box>
            <Typography variant='body2'>{value.title}</Typography>
          </Button>
        ))}
      </Stack>
    </>
  )
}
