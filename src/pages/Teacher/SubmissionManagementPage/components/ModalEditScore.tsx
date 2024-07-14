import { BoxContent } from '@/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, Typography, Slider } from '@mui/material'
import { useForm } from 'react-hook-form'
import { number, object } from 'yup'

type ModalEditScoreProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: number) => void
  defaultValue: number
}

const schema = object({
  score: number().required().min(0).max(10),
})

export const ModalEditScore = ({ isOpen, onClose, onSubmit, defaultValue }: ModalEditScoreProps) => {
  const { handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      score: defaultValue || 0,
    },
  })

  const onSubmitHandler = (data: { score: number }) => {
    onSubmit(data.score)
  }

  const score = watch('score')

  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent
        component='form'
        onSubmit={handleSubmit(onSubmitHandler)}
        minWidth={400}
        sx={{ p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}
      >
        <Typography textAlign='center' mb={3} variant='h5' color='primary'>
          Edit Score
        </Typography>
        <Typography textAlign='center' mb={2} variant='h6'>
          {score}
        </Typography>
        <Slider
          value={score}
          onChange={(_, newValue) => setValue('score', newValue as number)}
          min={0}
          max={10}
          step={0.5}
          marks
          valueLabelDisplay='auto'
          sx={{ mt: 2 }}
        />
        <Stack direction='row' gap={2} mt={3}>
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
