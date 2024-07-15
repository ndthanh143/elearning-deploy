import { BoxContent, LoadingButton } from '@/components'
import { Unit } from '@/services/unit/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

export type AddSectionProps = {
  isOpen: boolean
  onClose: () => void
  defaultValues?: Unit
  onSubmit: (data: SectionModalProps) => void
  isLoading?: boolean
}

export type SectionModalProps = {
  name: string
  description?: string
}

const schema = object({
  description: string(),
  name: string().required(),
})

export const ModalSection = ({ isOpen, onClose, defaultValues, onSubmit, isLoading }: AddSectionProps) => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
    },
  })

  const onSubmitHandler = (data: SectionModalProps) => {
    onSubmit(data)
  }

  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <BoxContent width={500} component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Typography variant='body1' fontWeight={600} textAlign='left' mb={2}>
          {defaultValues ? 'Edit' : 'Create new'} section
        </Typography>
        <Stack gap={2}>
          <TextField size='small' fullWidth placeholder='Section name' {...register('name')} />
          <Stack direction='row' justifyContent='end' gap={2}>
            <Button onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <LoadingButton variant='contained' type='submit' isLoading={isLoading}>
              {defaultValues ? 'Update' : 'Create'}
            </LoadingButton>
          </Stack>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
