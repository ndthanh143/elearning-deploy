import actions from '@/assets/images/icons/actions'
import { ConfirmPopup } from '@/components'
import { useAlert, useBoolean, useMenu } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { unitService } from '@/services/unit'
import { Unit } from '@/services/unit/types'
import { Settings } from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type ContentItemProps = {
  unit: Unit
  onClick?: () => void
  onEdit: () => void
  onDelete?: () => void
}

export const ContentItem = ({ unit, onClick, onEdit }: ContentItemProps) => {
  const queryClient = useQueryClient()
  const { triggerAlert } = useAlert()
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const { mutate: mutateDeleteUnit } = useMutation({
    mutationFn: unitService.delete,
    onSuccess: () => {
      triggerAlert('Delete successfully')
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      onClose()
      closeConfirm()
    },
    onError: () => triggerAlert('Delete failed'),
  })

  const handleEdit = () => {
    onEdit()
    onClose()
  }

  let childType: 'lecture' | 'assignment' | 'resource' | 'quiz' = 'lecture'
  if (unit.lectureInfo) {
    childType = 'lecture'
  }
  if (unit.assignmentInfo) {
    childType = 'assignment'
  }
  if (unit.resourceInfo) {
    childType = 'resource'
  }

  if (unit.quizInfo) {
    childType = 'quiz'
  }

  const dataProps = {
    lecture: {
      title: unit.lectureInfo?.lectureName,
      iconUrl: actions.lecture,
    },
    assignment: {
      title: unit.assignmentInfo?.assignmentTitle,
      iconUrl: actions.assignment,
    },
    resource: {
      title: unit.resourceInfo?.title,
      iconUrl: actions.resource,
    },
    quiz: {
      title: unit.quizInfo?.quizTitle,
      iconUrl: actions.quiz,
    },
  }

  const handleDelete = () => {
    mutateDeleteUnit(unit.id)
  }

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          cursor: 'pointer',
          ':hover': {
            color: 'primary.main',
          },
        }}
      >
        <Stack direction='row' gap={2} onClick={onClick} py={2}>
          <Box component='img' src={dataProps[childType].iconUrl} alt={dataProps[childType].title} width={25} />

          <Typography>{dataProps[childType].title}</Typography>
        </Stack>
        <IconButton onClick={onOpen}>
          <Settings />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} onClose={onClose} open={isOpen}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={openConfirm}>Delete</MenuItem>
      </Menu>

      <ConfirmPopup
        isOpen={isOpenConfirm}
        onClose={closeConfirm}
        onAccept={handleDelete}
        title='Confirm Deletion'
        subtitle='Are you sure you want to delete this item? This action cannot be undone.'
        type='delete'
      />
    </>
  )
}
