import { CustomModal, Flex } from '@/components'
import Editor from '@/components/ContentEditor/ContentEditor'
import { DoNotDisturbAltRounded } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
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
    <CustomModal title='Draft your anwser' isOpen={isOpen} onClose={onClose}>
      <Typography variant='body1' fontWeight={700} mb={0.5}>
        Your anwser
      </Typography>
      <Editor value={value} onChange={setValue} sx={{ maxHeight: '65vh', overflowY: 'scroll' }} />
      <Flex gap={2} mt={2}>
        <Button variant='outlined' onClick={onClose} fullWidth startIcon={<DoNotDisturbAltRounded />}>
          Cancel
        </Button>
        <Button variant='contained' onClick={handleSubmit} fullWidth>
          Submit
        </Button>
      </Flex>
    </CustomModal>
  )
}
