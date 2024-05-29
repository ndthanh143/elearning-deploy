import { BoxContent } from '@/components'
import { Account } from '@/services/user/user.dto'
import { CloseOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Stack,
  Typography,
} from '@mui/material'

type ModalUnsubmitProps = {
  isOpen: boolean
  onClose: () => void
  data: Account[]
}

export const ModalUnsubmit = ({ isOpen, onClose, data }: ModalUnsubmitProps) => {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent width={400}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h5'>Unsubmitted Students ({data.length})</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Box maxHeight='60vh' sx={{ overflow: 'scroll' }}>
          <List>
            {data.map((student) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt='Remy Sharp' src={student.avatarPath} />
                </ListItemAvatar>
                <ListItemText primary={student.fullName} secondary={student.email}></ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      </BoxContent>
    </Modal>
  )
}
