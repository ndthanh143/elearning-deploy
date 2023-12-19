import { CustomModal, ErrorField } from '@/components'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

export type UpdatePlanProps = {
  name: string
  description: string
}

export interface IUpdatePlanProps {
  isOpen: boolean
  onClose: () => void
  defaultValues: LessonPlan
  onSubmit: (data: UpdatePlanProps) => void
}

const schema = object({
  name: string().required('Please fill in plan name'),
  description: string().required('Please fill in description'),
})
export const UpdatePlan = ({ isOpen, onClose, defaultValues, onSubmit }: IUpdatePlanProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePlanProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description,
    },
  })

  const onSubmitHandler = (payload: UpdatePlanProps) => {
    onSubmit(payload)
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title='Update plan'>
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={2} mt={2}>
          <Stack gap={1}>
            <TextField placeholder='Name' size='small' fullWidth {...register('name')} />
            <ErrorField isShow={Boolean(errors?.name)} message={errors.name?.message} />
          </Stack>
          <Stack gap={1}>
            <TextField placeholder='Description' size='small' fullWidth {...register('description')} />
            <ErrorField isShow={Boolean(errors?.description)} message={errors.description?.message} />
          </Stack>
          <Divider />
          <Button variant='contained' type='submit'>
            Update
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  )
}
