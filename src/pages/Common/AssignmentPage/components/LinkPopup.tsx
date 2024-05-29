import { BoxContent } from '@/components'
import { Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

export type LinkPopupProps = {
  onSubmit: (value: string) => void
  isOpen: boolean
  onClose: () => void
}

export const LinkPopup = ({ onSubmit, isOpen, onClose }: LinkPopupProps) => {
  const [value, setValue] = useState('')

  const handleSubmit = () => onSubmit(value)
  return (
    <Modal open={isOpen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClose={onClose}>
      <BoxContent display='flex' flexDirection='column' gap={2}>
        <Typography fontWeight={500}>Add your link</Typography>

        <TextField
          variant='filled'
          size='small'
          label='Your link'
          value={value}
          sx={{ minWidth: 300 }}
          onChange={(e) => setValue(e.target.value)}
        />
        <Stack direction='row' justifyContent='end'>
          <Button onClick={onClose}>Cancel</Button>
          <Button color='primary' disabled={Boolean(value === '')} onClick={handleSubmit}>
            Add this Link
          </Button>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
