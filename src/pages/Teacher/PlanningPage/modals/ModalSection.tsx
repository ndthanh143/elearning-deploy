import { BoxContent } from '@/components'
import { Unit } from '@/services/unit/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

export type AddSectionProps = {
  isOpen: boolean
  onClose: () => void
  defaultValues?: Unit
  onSubmit: (data: SectionModalProps) => void
}

export type SectionModalProps = {
  name: string
  description: string
}

const schema = object({
  description: string().required(),
  name: string().required(),
})

export const ModalSection = ({ isOpen, onClose, defaultValues, onSubmit }: AddSectionProps) => {
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
        <Stack gap={2} my={2}>
          <TextField size='small' fullWidth placeholder='Section name' {...register('name')} />
          <TextField fullWidth placeholder='Description' {...register('description')} />

          <Stack direction='row' justifyContent='end' gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant='contained' type='submit'>
              {defaultValues ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
