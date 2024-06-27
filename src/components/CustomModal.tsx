import { BoxProps, IconButton, Modal, Typography } from '@mui/material'
import { BoxContent } from './BoxContent'
import { PropsWithChildren } from 'react'
import { Flex, LoadingContainer } from '.'
import { CloseRounded } from '@mui/icons-material'

export type CustomModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  loading?: boolean
} & BoxProps

export const CustomModal = ({
  isOpen,
  loading = false,
  onClose,
  title,
  children,
  ...props
}: PropsWithChildren<CustomModalProps>) => {
  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <LoadingContainer loading={loading}>
        <BoxContent width='80vw' {...props}>
          <Flex justifyContent='space-between' mb={2}>
            <Typography variant='body1'>{title}</Typography>
            <IconButton onClick={onClose}>
              <CloseRounded fontSize='small' />
            </IconButton>
          </Flex>
          {children}
        </BoxContent>
      </LoadingContainer>
    </Modal>
  )
}
