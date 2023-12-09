import { Button, Modal, Stack, Typography } from '@mui/material'
import { BoxContent } from '.'
import { grey } from '@mui/material/colors'

export type ConfirmPopupProps = {
  isOpen: boolean
  title: string
  subtitle: string
  onAccept: () => void
  onClose: () => void
  isLoading?: boolean
}

export const ConfirmPopup = ({ onAccept, onClose, isOpen, title, subtitle, isLoading }: ConfirmPopupProps) => {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent p={3} maxWidth={500}>
        <Typography variant='h5' fontWeight={500} mb={1}>
          {title}
        </Typography>
        <Typography color={grey[600]} mb={6}>
          {subtitle}
        </Typography>
        <Stack direction='row' justifyContent='center' gap={1}>
          <Button
            variant='outlined'
            color='error'
            onClick={onClose}
            sx={{ display: 'flex', alignItems: 'center' }}
            fullWidth
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={onAccept} sx={{ display: 'flex', alignItems: 'center' }} fullWidth>
            {isLoading ? 'Loading...' : 'Accept'}
          </Button>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
