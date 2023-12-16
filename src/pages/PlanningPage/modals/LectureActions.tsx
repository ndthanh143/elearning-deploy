import { CustomModal } from '@/components'
import Editor from '@/components/Editor'
import { CreateLecturePayload, Lecture } from '@/services/lecture/lecture.dto'
import { lectureService } from '@/services/lecture/lecture.service'
import { moduleKey } from '@/services/module/module.query'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { number, object, string } from 'yup'

export type AddLectureProps = { onClose: () => void } & (
  | {
      isOpen: boolean
      moduleId: number
      defaultData?: Lecture
      status: 'create'
    }
  | { status: 'update'; defaultData: Lecture; moduleId?: number; isOpen: boolean }
)

const schema = object({
  modulesId: number().required(),
  lectureContent: string().required(),
  lectureName: string().required(),
})

export const LectureActions = ({ isOpen, onClose, moduleId, defaultData, status }: AddLectureProps) => {
  const queryClient = useQueryClient()

  const { register, reset, handleSubmit, setValue, watch } = useForm<CreateLecturePayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      modulesId: moduleId,
      lectureContent: defaultData?.lectureContent,
      lectureName: defaultData?.lectureName,
    },
  })

  const { mutate: mutateCreateLecture } = useMutation({
    mutationFn: lectureService.create,
    onSuccess: () => {
      toast.success('Add new lecture successfully')
      onClose()
      reset()
      queryClient.invalidateQueries({ queryKey: moduleKey.lists() })
    },
  })

  const { mutate: mutateUpdateLecture } = useMutation({
    mutationFn: lectureService.update,
    onSuccess: () => {
      toast.success('Update lecture successfully')
      onClose()
      reset()
      queryClient.invalidateQueries({ queryKey: moduleKey.lists() })
    },
  })

  const onSubmitHandler = (data: CreateLecturePayload) => {
    status === 'update'
      ? mutateUpdateLecture({ id: defaultData.id, lectureName: data.lectureName, lectureContent: data.lectureContent })
      : mutateCreateLecture(data)
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={status === 'update' ? 'Update lecture' : 'Create lecture'}>
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <TextField
          placeholder='Lecture name'
          size='small'
          sx={{ my: 2 }}
          defaultValue={defaultData?.lectureName}
          fullWidth
          {...register('lectureName')}
        />
        <Box height='70vh' mb={2}>
          <Editor
            value={watch('lectureContent')}
            onChange={(value) => {
              setValue('lectureContent', value)
            }}
          />
        </Box>
        <Button fullWidth variant='contained' type='submit'>
          Submit
        </Button>
      </Box>
    </CustomModal>
  )
}
