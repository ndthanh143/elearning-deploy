import { BoxContent } from '@/components'
import { Module } from '@/services/module/module.dto'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

export type AddSectionProps = {
  isOpen: boolean
  onClose: () => void
  defaultValues?: Module
  onSubmit: (data: SectionModalProps) => void
  status: 'create' | 'update'
}

export type SectionModalProps = {
  modulesName: string
  description: string
}

const schema = object({
  description: string().required(),
  modulesName: string().required(),
})

export const ModalSection = ({ isOpen, onClose, defaultValues, onSubmit, status }: AddSectionProps) => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      modulesName: defaultValues?.modulesName || '',
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
          <TextField size='small' fullWidth placeholder='Section name' {...register('modulesName')} />
          <TextField fullWidth placeholder='Description' {...register('description')} />

          <Stack direction='row' justifyContent='end' gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant='contained' type='submit'>
              {status === 'create' ? 'Create' : 'Update'}
            </Button>
          </Stack>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
