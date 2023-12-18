import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { BoxContent, ConfirmPopup, NoData } from '.'
import { AddOutlined, CloseOutlined } from '@mui/icons-material'
import { useBoolean } from '@/hooks'
import { useState } from 'react'
import { userKeys } from '@/services/user/user.query'
import { useQuery } from '@tanstack/react-query'

type ModalAddStudentToCourseProps = {
  isOpen: boolean
  onClose: () => void
}
export const ModalAddStudentToCourse = ({ isOpen = true, onClose }: ModalAddStudentToCourseProps) => {
  const [search, setSearch] = useState('')

  const { value: isOpenConfirm, setFalse: closeConfirm, setTrue: openConfirm } = useBoolean()

  const studentsInstance = userKeys.list({ courseId: 6900950033432576 })
  const { data: students } = useQuery({ ...studentsInstance, select: (data) => data.content })

  const handleAccept = () => {}

  return (
    <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent minWidth={500}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h5'>Add student to course</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider />

        <Box mt={2}>
          <TextField
            size='small'
            fullWidth
            value={search}
            placeholder='Find student by email...'
            onChange={(e) => setSearch(e.target.value)}
          />
          {students?.length ? (
            <Box sx={{ overflowY: 'scroll', maxHeight: '70vh', mt: 2 }}>
              <List>
                {students?.map((student) => (
                  <ListItem
                    secondaryAction={
                      <IconButton edge='end' aria-label='add' onClick={openConfirm}>
                        <AddOutlined />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={student.avatarPath}>N</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={student.fullName} secondary={student.email} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <NoData />
          )}
        </Box>
        <ConfirmPopup
          isOpen={isOpenConfirm}
          onClose={closeConfirm}
          title='Confirm Actions'
          subtitle='Are you sure to add this student to your course?'
          onAccept={handleAccept}
        />
      </BoxContent>
    </Modal>
  )
}
