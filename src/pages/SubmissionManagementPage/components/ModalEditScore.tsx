import { BoxContent } from '@/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { number, object } from 'yup'

type ModalEditScoreProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: number) => void
  defaultValue: number
}

const schema = object({
  score: number().required(),
})
export const ModalEditScore = ({ isOpen, onClose, onSubmit, defaultValue }: ModalEditScoreProps) => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      score: defaultValue || 0,
    },
  })

  const onSubmitHandler = (data: { score: number }) => {
    onSubmit(data.score)
  }

  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent component='form' onSubmit={handleSubmit(onSubmitHandler)} minWidth={400}>
        <Typography textAlign='center' mb={2} variant='h5'>
          Edit Score
        </Typography>
        <TextField type='number' inputProps={{ max: 10, min: 0 }} fullWidth size='small' {...register('score')} />
        <Stack direction='row' gap={2} mt={2}>
          <Button variant='outlined' onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant='contained' type='submit' fullWidth>
            Submit
          </Button>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
