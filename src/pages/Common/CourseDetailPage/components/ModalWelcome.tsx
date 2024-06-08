import { Modal, Box, Typography } from '@mui/material'
import { Button, DangerouseLyRender } from '@/components'

interface IModalWelcomeProps {
  message: string
  isOpen: boolean
  onClose: () => void
}

export function ModalWelcome({ message, onClose, isOpen }: IModalWelcomeProps) {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        bgcolor='background.paper'
        borderRadius={2}
        boxShadow={24}
        maxWidth={600}
        mx='auto'
        my={4}
        p={4}
        textAlign='center'
      >
        <Typography variant='h2' fontWeight={700}>
          Welcome!
        </Typography>
        <DangerouseLyRender content={message} />
        <Button fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Start Learning
        </Button>
      </Box>
    </Modal>
  )
}
