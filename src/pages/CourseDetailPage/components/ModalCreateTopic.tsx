import { BoxContent } from '@/components'
import Editor from '@/components/Editor'
import { CloseOutlined } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
import { useState } from 'react'

export type ModalCreateTopicProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
}

export const ModalCreateTopic = ({ isOpen, onClose, onSubmit }: ModalCreateTopicProps) => {
  const [value, setValue] = useState('')

  const handleCancel = () => {
    setValue('')
    onClose()
  }

  const handleSubmit = () => onSubmit(value)

  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BoxContent minWidth={600}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h5'>Create topic</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Box height={400}>
          <Editor value={value} onChange={setValue} />
        </Box>
        <Box display='flex' justifyContent='space-between' alignItems='center' my={2}>
          {/* <Stack direction='row' gap={2} my={2}>
            <IconButton sx={{ borderRadius: '100%', border: 1 }}>
              <YouTube color='primary' />
            </IconButton>
          </Stack> */}
          <Stack direction='row' gap={2}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant='contained' onClick={handleSubmit}>
              Create
            </Button>
          </Stack>
        </Box>
      </BoxContent>
    </Modal>
  )
}
