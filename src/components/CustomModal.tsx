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
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent width='80vw' {...props}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' pb={1}>
          <Typography variant='h5'>{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider />
        {children}
      </BoxContent>
    </Modal>
  )
}
