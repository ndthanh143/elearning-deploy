import { ConfirmPopup, Flex } from '@/components'
import { useAuth, useBoolean, useMenu } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'
import { ChevronLeftOutlined, CloseOutlined, EditOutlined, MoreHorizOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export function ActionSetting() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const { lessonPlanId } = useParams()

  const { anchorEl: anchorElMore, isOpen, onClose, onOpen } = useMenu()
  const { value: isOpenConfirmPopup, setFalse: closeConfirmPopup, setTrue: openConfirmPopup } = useBoolean()
  const { value: isOpenSelectPlans, setFalse: closeSelectPlans, setTrue: openSelectPlans } = useBoolean()

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

  const handleDelete = () => {
    mutateDelete(Number(lessonPlanId))
  }

  const handleBackPage = () => {
    navigate('/planning')
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
      </Box>
      <Menu
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
      >
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <EditOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText>
              <Typography variant='body2'>Edit</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
        <Divider />
        <MenuList>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              openConfirmPopup()
              onClose()
            }}
          >
            <Typography variant='body2'>Move to trash</Typography>
          </MenuItem>
        </MenuList>
      </Menu>
      <ConfirmPopup
        onClose={closeConfirmPopup}
        onAccept={handleDelete}
        isOpen={isOpenConfirmPopup}
        title='Confirm delete plan'
        subtitle='Are you sure to delete this plan, this action can not be revert'
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
