import { CustomModal, ErrorField } from '@/components'
import { useAuth } from '@/hooks'
import { CreateLessonPlanPayload } from '@/services/lessonPlan/lessonPlan.dto'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { number, object, string } from 'yup'

export type AddPlanProps = {
  isOpen: boolean
  onClose: () => void
}

const schema = object({
  name: string().required('Please fill in plan name'),
  description: string().required('Please fill in description'),
  teacherId: number().required(),
})
export const AddPlan = ({ isOpen, onClose }: AddPlanProps) => {
  const queryClient = useQueryClient()

  const { profile } = useAuth()

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLessonPlanPayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      teacherId: profile?.data.id,
    },
  })

  const { mutate: mutateCreateLessonPlan } = useMutation({
    mutationFn: lessonPlanService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      toast.success('Create new plan successfully')
      onClose()
      reset()
    },
  })

  const onSubmitHandler = (payload: CreateLessonPlanPayload) => {
    mutateCreateLessonPlan(payload)
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title='New plan'>
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
            Create
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  )
}
