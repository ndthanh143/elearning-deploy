import { icons } from '@/assets/icons'
import { Flex, IconContainer } from '@/components'
import { Box, Button, IconButton, Modal, Stack, TextField, Typography } from '@mui/material'
import { FormTaskModal } from '.'

interface IModalAddTaskProps {
  isOpen: boolean
  onClose: () => void
  form: FormTaskModal
  loading: boolean
  status: 'edit' | 'create'
  onSubmit: (payload: { name: string; description: string; startDate: string; endDate: string }) => void
}
export function ModalActionsTask({ isOpen, status, onClose, onSubmit, form }: IModalAddTaskProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form

  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} bgcolor='white' p={2} borderRadius={3} minWidth={500}>
        <Flex justifyContent='space-between'>
          <Flex gap={1}>
            <Box width={40} height={40}>
              {icons['task']}
            </Box>
            <Stack>
              <Typography variant='body1' fontWeight={700} textTransform='uppercase'>
                Task
              </Typography>
              <Typography variant='body2' fontWeight={400}>
                {status === 'create' ? 'Add task and setup notification' : 'Edit task and setup notification'}
              </Typography>
            </Stack>
          </Flex>
          <IconButton size='small' onClick={onClose}>
            {icons['close']}
          </IconButton>
        </Flex>
        <Stack gap={2} mt={3}>
          <Flex gap={2} alignItems='start'>
            <IconContainer isActive>{icons['title']}</IconContainer>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='Task name...'
              {...register('name')}
              error={errors.name ? true : false}
              helperText={errors.name?.message}
            />
          </Flex>
          <Flex gap={2} alignItems='start'>
            <IconContainer isActive>{icons['description']}</IconContainer>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='Task description...'
              multiline
              minRows={3}
              {...register('description')}
              error={errors.description ? true : false}
              helperText={errors.description?.message}
            />
          </Flex>
          <Flex gap={2} alignItems='start'>
            <IconContainer isActive>{icons['calendar']}</IconContainer>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              type='date'
              {...register('startDate')}
              error={errors.startDate ? true : false}
              helperText={errors.startDate?.message}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
                value: form.watch('startDate')
                  ? new Date(form.watch('startDate')).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0],
              }}
            />
          </Flex>
          <Flex gap={2} alignItems='start'>
            <IconContainer isActive>{icons['deadline']}</IconContainer>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              type='date'
              {...register('endDate')}
              error={errors.endDate ? true : false}
              helperText={errors.endDate?.message}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
                value: form.watch('endDate')
                  ? new Date(form.watch('endDate')).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0],
              }}
            />
          </Flex>
        </Stack>
        <Flex gap={1} justifyContent='end' mt={2}>
          <Button>Cancel</Button>
          <Button variant='contained' type='submit'>
            {status === 'create' ? 'Create' : 'Save'}
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}
