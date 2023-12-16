import { ConfirmPopup } from '@/components'
import { useBoolean, useMenu } from '@/hooks'
import { ArticleOutlined, Settings } from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'

export type ContentItemProps = {
  iconUrl?: string
  title: string
  onClick?: () => void
  onEdit: () => void
  onDelete: () => void
}

export const ContentItem = ({ iconUrl, title, onClick, onDelete, onEdit }: ContentItemProps) => {
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const handleEdit = () => {
    onEdit()
    onClose()
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
          {iconUrl ? <Box component='img' src={iconUrl} alt={title} width={25} /> : <ArticleOutlined color='primary' />}
          <Typography>{title}</Typography>
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
