import { icons } from '@/assets/icons'
import { Flex, IconContainer } from '@/components'
import { Box, Button, IconButton, Modal, Stack, TextField, Typography } from '@mui/material'

interface IModalAddTaskProps {
  isOpen: boolean
  onClose: () => void
}
export function ModalAddTask({ isOpen, onClose }: IModalAddTaskProps) {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <Box bgcolor='white' p={2} borderRadius={3} minWidth={500}>
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
                Add task and setup notification
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
            <TextField fullWidth variant='outlined' size='small' placeholder='Add task name' />
          </Flex>
          <Flex gap={2} alignItems='start'>
            <IconContainer isActive>{icons['description']}</IconContainer>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='Add task description'
              multiline
              minRows={3}
            />
          </Flex>
          <Flex gap={2} alignItems='start'>
            <IconContainer isActive>{icons['calendar']}</IconContainer>
            <TextField fullWidth variant='outlined' size='small' placeholder='Add task description' type='date' />
          </Flex>
          <Flex gap={2} alignItems='start'>
            <IconContainer isActive>{icons['deadline']}</IconContainer>
            <TextField fullWidth variant='outlined' size='small' placeholder='Add task description' type='date' />
          </Flex>
        </Stack>
        <Flex gap={1} justifyContent='end' mt={2}>
          <Button>Cancel</Button>
          <Button variant='contained'>Submit</Button>
        </Flex>
      </Box>
    </Modal>
  )
}
