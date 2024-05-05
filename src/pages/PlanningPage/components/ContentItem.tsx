import actions from '@/assets/images/icons/actions'
import { ConfirmPopup } from '@/components'
import { useBoolean, useMenu } from '@/hooks'
import { Unit } from '@/services/unit/types'
import { Settings } from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'

export type ContentItemProps = {
  unit: Unit
  onClick?: () => void
  onEdit: () => void
  onDelete: () => void
}

export const ContentItem = ({ unit, onClick, onDelete, onEdit }: ContentItemProps) => {
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const handleEdit = () => {
    onEdit()
    onClose()
  }

  let childType: 'lecture' | 'assignment' | 'resource' = 'lecture'
  if (unit.lectureInfo) {
    childType = 'lecture'
  }
  if (unit.assignmentInfo) {
    childType = 'assignment'
  }
  if (unit.resourceInfo) {
    childType = 'resource'
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
        onAccept={onDelete}
        title='Confirm Deletion'
        subtitle='Are you sure you want to delete this item? This action cannot be undone.'
      />
    </>
  )
}
