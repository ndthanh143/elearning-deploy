import { ConfirmPopup, CustomMenu, Flex } from '@/components'
import { useAlert, useAuth, useBoolean, useMenu } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'
import {
  ChevronLeftOutlined,
  CloseOutlined,
  DeleteRounded,
  DoNotDisturbAltRounded,
  EditOutlined,
  MoreHorizOutlined,
  SaveRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

const schema = object({
  lessonPlanName: string().required('Please fill in the lesson plan name'),
})

export function ActionSetting() {
  const navigate = useNavigate()
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const { lessonPlanId } = useParams()

  const { anchorEl: anchorElMore, isOpen, onClose, onOpen } = useMenu()
  const { value: isOpenConfirmPopup, setFalse: closeConfirmPopup, setTrue: openConfirmPopup } = useBoolean()
  const { value: isOpenSelectPlans, setFalse: closeSelectPlans, setTrue: openSelectPlans } = useBoolean()
  const { value: isEditLessonPlan, setTrue: setEditLessonPlan, setFalse: closeEditLessonPlan } = useBoolean()
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm({ resolver: yupResolver(schema) })

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data: lessonPlans } = useQuery({ ...lessonPlanInstance })
  const currentLessonPlan = lessonPlans?.content.find((lessonPlan) => lessonPlan.id === Number(lessonPlanId))

  const { mutate: mutateDelete } = useMutation({
    mutationFn: lessonPlanService.delete,
    onSuccess: () => {
      toast.success('Delete lesson plan successfully')
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      handleBackPage()
    },
  })

  const { mutate: mutateUpdateLessonPlan } = useMutation({
    mutationFn: lessonPlanService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      triggerAlert('Update lesson plan successfully', 'success')
      closeEditLessonPlan()
    },
  })

  const handleDelete = () => {
    mutateDelete(Number(lessonPlanId))
  }

  const handleBackPage = () => {
    navigate('/planning')
  }

  const handleEditPlan = (data: { lessonPlanName: string }) => {
    isDirty && mutateUpdateLessonPlan({ id: Number(lessonPlanId), name: data.lessonPlanName })
  }

  return (
    <>
      <Box
        component={motion.div}
        animate={{ scale: !isOpenSelectPlans ? 1 : 0, opacity: !isOpenSelectPlans ? 1 : 0 }}
        position='absolute'
        borderRadius={4}
        bgcolor='white'
        sx={{ boxShadow: 1 }}
        display='flex'
        gap={1}
        top={20}
        px={2}
        py={1}
        left={20}
        zIndex={10}
      >
        <IconButton onClick={handleBackPage} color='secondary'>
          <ChevronLeftOutlined />
        </IconButton>

        {isEditLessonPlan ? (
          <Flex component='form' gap={1} onSubmit={handleSubmit(handleEditPlan)}>
            <TextField
              defaultValue={currentLessonPlan?.name}
              {...register('lessonPlanName')}
              size='small'
              variant='standard'
            />
            <IconButton color='primary' type='submit' disabled={!isValid || !isDirty}>
              <SaveRounded fontSize='small' />
            </IconButton>
            <IconButton type='button' onClick={closeEditLessonPlan}>
              <DoNotDisturbAltRounded fontSize='small' />
            </IconButton>
          </Flex>
        ) : (
          <>
            <Button
              variant='text'
              color='secondary'
              sx={{ display: 'flex', alignItems: 'center', px: 2, fontWeight: 700 }}
              onClick={openSelectPlans}
            >
              {currentLessonPlan?.name}
              <ChevronLeftOutlined sx={{ rotate: '-90deg' }} fontSize='small' />
            </Button>
            <Divider orientation='vertical' flexItem />
            <IconButton color='secondary' onClick={onOpen}>
              <MoreHorizOutlined />
            </IconButton>
          </>
        )}
      </Box>
      <CustomMenu
        open={isOpen}
        anchorEl={anchorElMore}
        onClose={onClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          paper: {
            style: {
              marginTop: 10,
            },
          },
        }}
        sx={{ py: 0 }}
      >
        <MenuList sx={{ py: 0 }}>
          <MenuItem
            onClick={() => {
              setEditLessonPlan()
              onClose()
            }}
          >
            <ListItemIcon>
              <EditOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>
              <Typography variant='body2'>Edit</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
        <Divider />
        <MenuList sx={{ py: 0 }}>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              openConfirmPopup()
              onClose()
            }}
          >
            <ListItemIcon>
              <DeleteRounded color='error' fontSize='small' />
            </ListItemIcon>
            <Typography variant='body2'>Move to trash</Typography>
          </MenuItem>
        </MenuList>
      </CustomMenu>
      <ConfirmPopup
        onClose={closeConfirmPopup}
        onAccept={handleDelete}
        isOpen={isOpenConfirmPopup}
        title='Confirm delete plan'
        subtitle='Are you sure to delete this plan, this action can not be revert'
        type='delete'
      />
      <Box
        component={motion.div}
        animate={{ scale: isOpenSelectPlans ? 1 : 0, opacity: isOpenSelectPlans ? 1 : 0 }}
        position='absolute'
        borderRadius={4}
        bgcolor='white'
        sx={{ boxShadow: 1 }}
        display='flex'
        flexDirection='column'
        gap={1}
        top={20}
        py={1}
        left={20}
        zIndex={10}
      >
        <Flex gap={2} px={2} justifyContent='space-between' minWidth={250}>
          <Typography variant='body2' fontWeight={700}>
            Recent Plans
          </Typography>
          <IconButton size='small' onClick={closeSelectPlans}>
            <CloseOutlined fontSize='small' />
          </IconButton>
        </Flex>
        <Divider />
        <Stack px={2} py={1}>
          <Stack>
            {lessonPlans?.content.map((plan) => (
              <MenuItem
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  navigate(`/planning/${plan.id}`)
                  closeSelectPlans()
                }}
              >
                <Typography variant='body2' fontWeight={500}>
                  {plan.name}
                </Typography>
              </MenuItem>
            ))}
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
