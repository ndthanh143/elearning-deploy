import {
  Avatar,
  Box,
  CircularProgress,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { coursesRegistrationService } from '@/services/coursesRegistration/coursesRegistration.service'
import { toast } from 'react-toastify'
import { debounce, differenceBy } from 'lodash'

type ModalAddStudentToCourseProps = {
  isOpen: boolean
  onClose: () => void
  courseId: number
}
export const ModalAddStudentToCourse = ({ isOpen, courseId, onClose }: ModalAddStudentToCourseProps) => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const { value: isOpenConfirm, setFalse: closeConfirm, setTrue: openConfirm } = useBoolean()

  const studentsInstance = userKeys.list({ courseId })
  const { data: students, isLoading: isStudentLoading } = useQuery({
    ...studentsInstance,
    select: (data) => data.content,
  })

  const searchStudentsInstance = userKeys.search({ email: search })
  const { data: studentsSearch, isLoading: isSearchLoading } = useQuery({
    ...searchStudentsInstance,
    select: (data) => {
      if (students) {
        const filterStudents = differenceBy(data.content, students, 'id')

        return filterStudents
      }
      return data.content
    },
    enabled: Boolean(students),
  })

  const { mutate: mutateEnroll } = useMutation({
    mutationFn: coursesRegistrationService.enroll,
    onSuccess: () => {
      toast.success('Add student to course successfully!')
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      closeConfirm()
    },
  })

  const handleSearch = debounce(setSearch, 500)

  const handleAccept = () => {
    selectedStudent && mutateEnroll({ courseId, studentId: selectedStudent })
  }

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
            // value={search}
            placeholder='Find student by email...'
            InputProps={{
              endAdornment: (isSearchLoading || isStudentLoading) && (
                <CircularProgress sx={{ width: 10 }} size='1.2rem' />
              ),
            }}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {studentsSearch?.length ? (
            <Box sx={{ overflowY: 'scroll', maxHeight: '70vh', mt: 2 }}>
              <List>
                {studentsSearch?.map((student) => (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge='end'
                        aria-label='add'
                        onClick={() => {
                          openConfirm()
                          setSelectedStudent(student.id)
                        }}
                      >
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
