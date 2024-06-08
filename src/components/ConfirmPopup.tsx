import { Button, CircularProgress, Modal, Stack, Typography } from '@mui/material'
import { Flex } from '.'
import { grey } from '@mui/material/colors'
import { DeleteOutline, InfoOutlined } from '@mui/icons-material'

export type ConfirmPopupProps = {
  isOpen: boolean
  title?: string
  subtitle?: string
  onAccept: () => void
  onClose: () => void
  isLoading?: boolean
  type?: 'delete' | 'confirm'
}

export const ConfirmPopup = ({
  onAccept,
  onClose,
  isOpen,
  title,
  subtitle,
  isLoading,
  type = 'confirm',
}: ConfirmPopupProps) => {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <Stack bgcolor='white' borderRadius={3} p={3} maxWidth={500} gap={1}>
        <Flex alignItems='center' gap={1} mb={1} justifyContent='center'>
          {type === 'delete' ? <DeleteOutline color='error' /> : <InfoOutlined fontSize='large' />}
          <Typography variant='h3' fontWeight={500}>
            {title}
          </Typography>
        </Flex>
        <Typography color={grey[600]} mb={2} textAlign='center'>
          {subtitle}
        </Typography>
        <Stack justifyContent='center' gap={1}>
          <Button
            variant='contained'
            onClick={onAccept}
            sx={{ display: 'flex', alignItems: 'center' }}
            fullWidth
            color={type === 'delete' ? 'error' : 'primary'}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Accept'}
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={onClose}
            sx={{ display: 'flex', alignItems: 'center' }}
            fullWidth
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  )
}
