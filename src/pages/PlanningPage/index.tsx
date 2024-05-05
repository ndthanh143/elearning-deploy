import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AutoFixNormal, DeleteOutline, MoreHorizOutlined } from '@mui/icons-material'
import {
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'

import { formatDate } from '@/utils'
import { gray } from '@/styles/theme'
import { ConfirmPopup, Flex } from '@/components'
import { useAuth, useBoolean, useMenu } from '@/hooks'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'

import { AddPlanSection } from './components'
import { UpdatePlan, UpdatePlanProps } from './modals'

import thumbnailBasic from '@/assets/images/planingPage/thumbnail-basic.webp'

const thumbnailProps = {
  basic: {
    src: thumbnailBasic,
    alt: 'basic',
  },
  mindmap: {
    src: 'https://images.wondershare.com/edrawmind/articles2023/how-to-make-a-mind-map/mind-map.png',
    alt: 'mindmap',
  },
}

export const PlanningPage = () => {
  const { profile } = useAuth()

  const navigate = useNavigate()

  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlan | null>(null)

  const { value: isOpenEdit, setFalse: closeEdit, setTrue: openEdit } = useBoolean(false)
  const { value: isOpenConfirmPopup, setFalse: closeConfirmPopup, setTrue: openConfirmPopup } = useBoolean(false)

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data, refetch } = useQuery({ ...lessonPlanInstance, enabled: !!profile?.data.id })

  const { anchorEl: anchorElMenu, isOpen: isOpenMoreMenu, onClose: closeMoreMenu, onOpen: openMoreMenu } = useMenu()

  const { mutate: mutateDelete, isPending: isLoadingDelete } = useMutation({
    mutationFn: lessonPlanService.delete,
    onSuccess: () => {
      closeConfirmPopup()
      refetch()
      toast.success('Delete lesson plan successfully')
    },
    onError: () => {
      toast.error('This plan is being used by some course, please delete this course or change plan before delete')
    },
  })

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: lessonPlanService.update,
    onSuccess: () => {
      refetch()
      toast.success('Update lesson plan successfully')
      closeEdit()
    },
  })

  const handleDelete = () => {
    selectedLessonPlan && mutateDelete(selectedLessonPlan.id)
  }
  const handleEdit = (payload: UpdatePlanProps) => {
    selectedLessonPlan && mutateUpdate({ ...payload, id: selectedLessonPlan.id, status: 1 })
  }

  const planName = {
    mindmap: 'Mind Map',
    basic: 'Basic',
  }

  useEffect(() => {
    if (data && data.content.length) {
      setSelectedLessonPlan(data.content[0])
    }
  }, [data])

  return (
    <Container>
      <AddPlanSection />
      <Grid container mt={1} spacing={4}>
        {data?.content.map((plan) => (
          <Grid item xs={3}>
            <Box
              borderRadius={4}
              overflow='hidden'
              border={1}
              borderColor={gray[200]}
              bgcolor={gray[50]}
              sx={{ cursor: 'pointer', ':hover': { bgcolor: gray[100], transition: 'all ease 0.2s' } }}
            >
              <Box
                component='img'
                src={thumbnailProps[(plan.type as 'basic' | 'mindmap') || 'basic'].src}
                alt={thumbnailProps[(plan.type as 'basic' | 'mindmap') || 'basic'].alt}
                sx={{ width: '100%', height: 150, backgroundColor: 'white' }}
                onClick={() => navigate(`/planning/${plan.id}`)}
              />
              <Box paddingX={2} paddingY={2}>
                <Typography variant='body1' fontWeight='bold'>
                  {plan.name}
                </Typography>
                <Typography variant='body2' color={gray[300]}>
                  {formatDate.toRelative(new Date())}
                </Typography>
                <Flex justifyContent='space-between'>
                  <Chip
                    variant='filled'
                    label={planName[plan.type ? (plan.type as 'mindmap') : 'basic']}
                    color='primary'
                    size='small'
                    sx={{ mt: 1 }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedLessonPlan(plan)
                      openMoreMenu(e)
                    }}
                    color={isOpenMoreMenu ? 'primary' : 'default'}
                  >
                    <MoreHorizOutlined fontSize='small' />
                  </IconButton>
                </Flex>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      {selectedLessonPlan && isOpenEdit && (
        <UpdatePlan isOpen={isOpenEdit} onClose={closeEdit} onSubmit={handleEdit} defaultValues={selectedLessonPlan} />
      )}
      <Menu open={isOpenMoreMenu} onClose={closeMoreMenu} anchorEl={anchorElMenu}>
        <MenuItem onClick={() => navigate(`/planning/${selectedLessonPlan?.id}`)}>
          <ListItemIcon>
            <AutoFixNormal fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Open</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            openConfirmPopup()
            closeMoreMenu()
          }}
        >
          <ListItemIcon>
            <DeleteOutline fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Move to trash</Typography>
        </MenuItem>
      </Menu>
      <ConfirmPopup
        isOpen={isOpenConfirmPopup}
        onClose={closeConfirmPopup}
        onAccept={handleDelete}
        title='Confirm Delete'
        isLoading={isLoadingDelete}
        subtitle='Are you sure to delete this plan, this action can not be revert.'
      />
    </Container>
  )
}
