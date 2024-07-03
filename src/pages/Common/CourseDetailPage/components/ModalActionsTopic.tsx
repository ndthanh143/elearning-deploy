import { ContentEditable, Flex, LoadingContainer } from '@/components'
import { useAuth } from '@/hooks'
import { Avatar, Button, Modal, Stack, Typography } from '@mui/material'
import { useState, useEffect } from 'react'

export type ModalActionsTopicProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
  isLoading: boolean
} & ({ status: 'update'; defaultValue: string } | { status: 'create'; defaultValue?: string })

export const ModalActionsTopic = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
  status,
  defaultValue = '',
}: ModalActionsTopicProps) => {
  const { profile } = useAuth()
  const [value, setValue] = useState<string>(defaultValue)

  // Update internal state when defaultValue changes (for update scenario)
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleCancel = () => {
    setValue('')
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(value)
  }

  useEffect(() => {
    if (!isOpen && status === 'create') {
      setValue('')
    }
  }, [isOpen])

  return (
    <Modal
      open={isOpen}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
      onClose={handleCancel}
    >
      <LoadingContainer loading={isLoading}>
        <Stack bgcolor='white' borderRadius={3} p={3} gap={2}>
          <Flex alignItems='center' gap={1}>
            <Avatar src={profile?.data.avatarPath}>{profile?.data.fullName.charAt(0)}</Avatar>
            <Typography fontWeight={500}>{profile?.data.fullName}</Typography>
          </Flex>
          <ContentEditable
            value={value}
            onChange={(value) => setValue(value)}
            placeholder='What’s on your mind?'
            sx={{
              border: '1px dashed grey',
            }}
          />

          <Stack direction='row' gap={2} justifyContent='end' mt={2}>
            <Button variant='contained' onClick={handleSubmit} fullWidth>
              {status === 'create' ? 'Create' : 'Update'}
            </Button>
          </Stack>
        </Stack>
      </LoadingContainer>
    </Modal>
  )
}
