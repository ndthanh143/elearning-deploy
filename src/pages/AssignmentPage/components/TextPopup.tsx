import { BoxContent } from '@/components'
import Editor from '@/components/Editor'
import { CloseOutlined } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
import { useState } from 'react'

export type TextPopupProps = {
  defaultValue?: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
}

export const TextPopup = ({ defaultValue = '', isOpen, onClose, onSubmit }: TextPopupProps) => {
  const [value, setValue] = useState(defaultValue)

  const handleSubmit = () => {
    onSubmit(value)
  }

  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClose={onClose}>
      <BoxContent width='80%' height='80vh' display='flex' flexDirection='column'>
        <Stack direction='row' justifyContent='space-between' mb={1}>
          <Typography variant='h5'>Draft your anwser</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider />
        <Box height='100%' my={4}>
          <Editor value={value} onChange={setValue} />
        </Box>
        <Button variant='contained' onClick={handleSubmit}>
          Submit
        </Button>
      </BoxContent>
    </Modal>
  )
}
