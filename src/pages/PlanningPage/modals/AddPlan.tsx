import { CustomModal, ErrorField, LoadingOverlay } from '@/components'
import { useAuth } from '@/hooks'
import { CreateLessonPlanPayload } from '@/services/lessonPlan/lessonPlan.dto'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, MenuItem, Select, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
  type: string().required("Please select plan's type"),
})
export const AddPlanModal = ({ isOpen, onClose }: AddPlanProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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

  const { mutate: mutateCreateLessonPlan, isPending: isPendingCreate } = useMutation({
    mutationFn: lessonPlanService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      toast.success('Create new plan successfully')
      onClose()
      reset()
      navigate(`/planning/${data.id}`)
    },
  })

  const onSubmitHandler = (payload: CreateLessonPlanPayload) => {
    mutateCreateLessonPlan(payload)
  }

  return (
    <>
      <CustomModal isOpen={isOpen} onClose={onClose} title='New plan' width={'fit-content'} minWidth={500}>
        <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack gap={2}>
            <Stack gap={1}>
              <TextField label='Name' size='small' fullWidth {...register('name')} />
              <ErrorField isShow={Boolean(errors?.name)} message={errors.name?.message} />
            </Stack>
            <Stack gap={1}>
              <TextField label='Description' size='small' fullWidth {...register('description')} />
              <ErrorField isShow={Boolean(errors?.description)} message={errors.description?.message} />
            </Stack>
            <Stack gap={1}>
              <Select id='type-select' labelId='type-select' size='small' {...register('type')}>
                <MenuItem value={'basic'}>Basic</MenuItem>
                <MenuItem value={'mindmap'}>Mind Map</MenuItem>
              </Select>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Button variant='contained' type='submit'>
              Create
            </Button>
          </Stack>
        </Box>
      </CustomModal>
      <LoadingOverlay isOpen={isPendingCreate} title='Creating New Plan...' />
    </>
  )
}
