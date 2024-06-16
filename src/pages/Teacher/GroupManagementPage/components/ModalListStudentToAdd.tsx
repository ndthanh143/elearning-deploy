import { CustomModal } from '@/components'
import { useAlert } from '@/hooks'
import { groupService } from '@/services'
import { coursesRegistrationKeys } from '@/services/coursesRegistration/coursesRegistration.query'
import { groupKeys } from '@/services/group/query'
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface IModalListStudentToAddProps {
  courseId: number
  onClose: () => void
  isOpen: boolean
  groupId: number
  groupName: string
  maxStudent: number
}
export function ModalListStudentToAdd({
  courseId,
  groupId,
  maxStudent,
  groupName,
  isOpen,
  onClose,
}: IModalListStudentToAddProps) {
  const { triggerAlert } = useAlert()
  const [checked, setChecked] = useState<number[]>([])
  const queryClient = useQueryClient()

  const courseRegistrationInstance = coursesRegistrationKeys.list({ courseId })
  const { data: courseRegistrations } = useQuery({
    ...courseRegistrationInstance,
    enabled: Boolean(courseId),
    select: (data) => data.content.map((item) => item.studentInfo),
  })

  const handleToggle = (value: number) => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const { mutate: mutateAddStudent } = useMutation({
    mutationFn: groupService.addStudentToGroup,
  })

  const handleAddStudentToGroup = async () => {
    if (checked.length) {
      const promises = checked.map((studentId) => mutateAddStudent({ groupId, studentId }))
      await Promise.all(promises)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
          onClose()
          const message = `Add ${checked.length} student to group successfully!`
          triggerAlert(message)
        })
        .catch(() => {
          triggerAlert('Add student to group failed!', 'error')
        })
    }
  }

  return (
    courseRegistrations && (
      <CustomModal isOpen={isOpen} title='List student' maxWidth={450} onClose={onClose}>
        <Divider />
        <List dense sx={{ width: '100%', maxWidth: 450, bgcolor: 'background.paper' }}>
          {courseRegistrations.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value}`
            return (
              <ListItem
                key={value.id}
                secondaryAction={
                  <Checkbox
                    edge='end'
                    disabled={checked.length >= maxStudent && checked.indexOf(value.id) === -1}
                    onChange={() => handleToggle(value.id)}
                    checked={checked.indexOf(value.id) !== -1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                }
                disablePadding
              >
                <ListItemButton
                  disabled={checked.length >= maxStudent && checked.indexOf(value.id) === -1}
                  onClick={() => handleToggle(value.id)}
                >
                  <ListItemAvatar>
                    <Avatar alt={value.fullName} src={value.avatarPath} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={value.fullName} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
        <Divider sx={{ my: 2 }} />
        <Button fullWidth variant='contained' disabled={!checked.length} onClick={handleAddStudentToGroup}>
          Add {checked.length} student to {groupName}
        </Button>
      </CustomModal>
    )
  )
}
