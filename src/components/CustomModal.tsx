import { BoxProps, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
import { BoxContent } from './BoxContent'
import { CloseOutlined } from '@mui/icons-material'
import { PropsWithChildren } from 'react'

export type CustomModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
} & BoxProps

export const CustomModal = ({ isOpen, onClose, title, children, ...props }: PropsWithChildren<CustomModalProps>) => {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <BoxContent width='80vw' {...props}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
          <Typography variant='body1'>{title}</Typography>
        </Stack>
        {children}
      </BoxContent>
    </Modal>
  )
}
