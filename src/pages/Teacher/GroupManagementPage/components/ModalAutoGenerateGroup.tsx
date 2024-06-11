import { CustomModal } from '@/components'
import { Button, Stack, TextField } from '@mui/material'
import { FormDataGenerateGroup } from '..'

interface IModalAutoGenerateGroupProps {
  isOpen: boolean
  onClose: () => void
  loading: boolean
  form: FormDataGenerateGroup
  onSubmit: (payload: { maxMember: number; minMember: number }) => void
}

export function ModalAutoGenerateGroup({ isOpen, onClose, loading, onSubmit, form }: IModalAutoGenerateGroupProps) {
  const { register, handleSubmit } = form
  return (
    <CustomModal title='Auto generate' isOpen={isOpen} onClose={onClose} loading={loading} sx={{ maxWidth: 500 }}>
      <Stack component='form' onSubmit={handleSubmit(onSubmit)} gap={2}>
        <TextField type='number' label='Min member' {...register('minMember')} />
        <TextField type='number' label='Max member' {...register('maxMember')} />
        <Button variant='contained' fullWidth type='submit'>
          Create
        </Button>
      </Stack>
    </CustomModal>
  )
}
