import { BoxContent } from '@/components'
import Editor from '@/components/Editor'
import { CloseOutlined } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
import { useState } from 'react'

export type ModalActionsTopicProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
} & ({ status: 'update'; defaultValue: string } | { status: 'create'; defaultValue?: string })

export const ModalActionsTopic = ({ isOpen, onClose, onSubmit, status, defaultValue = '' }: ModalActionsTopicProps) => {
  const [value, setValue] = useState(defaultValue)

  const handleCancel = () => {
    setValue('')
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(value)
    status === 'create' && setValue('')
  }

  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BoxContent minWidth={600}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h5'>{status === 'create' ? 'Create' : 'Update'} topic</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Box height={400}>
          <Editor value={value} onChange={setValue} />
        </Box>
        <Stack direction='row' gap={2} justifyContent='end' mt={2}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant='contained' onClick={handleSubmit}>
            {status === 'create' ? 'Create' : 'Update'}
          </Button>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
