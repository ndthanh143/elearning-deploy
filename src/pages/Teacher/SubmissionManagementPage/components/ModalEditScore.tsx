import { BoxContent } from '@/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, Typography, Slider, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { number, object, string } from 'yup'

type ModalEditScoreProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: { score: number; feedback?: string }) => void
  defaultValue: number
  defaultFeedack?: string
}

const schema = object({
  score: number().required().min(0).max(10),
  feedback: string(),
})

export const ModalEditScore = ({ isOpen, onClose, onSubmit, defaultValue, defaultFeedack }: ModalEditScoreProps) => {
  const { handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      score: defaultValue || 0,
      feedback: defaultFeedack || '',
    },
  })

  const onSubmitHandler = (data: { score: number; feedback?: string }) => {
    onSubmit(data)
  }

  const score = watch('score')
  const feedback = watch('feedback')

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
        <Typography
          textAlign='center'
          mb={2}
          variant='h6'
          bgcolor='#ededed'
          width='fit-content'
          px={1}
          borderRadius={2}
          mx='auto'
        >
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
        <Stack mb={2} gap={1}>
          <Typography variant='body2' fontWeight={700}>
            Feedback:
          </Typography>
          <TextField
            multiline
            minRows={4}
            maxRows={5}
            placeholder='Feedback...'
            value={feedback}
            defaultValue={defaultFeedack}
            onChange={(e) => setValue('feedback', e.target.value)}
          />
        </Stack>
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
