import { CustomModal } from '@/components'
import Editor from '@/components/Editor'
import { CreateLecturePayload, Lecture, UpdateLecturePayload } from '@/services/lecture/lecture.dto'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

export type AddLectureProps = {
  isOpen: boolean
  defaultData?: Lecture
  onClose: () => void
  onCreate?: (payload: CreateLecturePayload) => void
  onUpdate?: (payload: UpdateLecturePayload) => void
}

const schema = object({
  lectureContent: string().required(),
  lectureName: string().required(),
})

export const LectureActions = ({ isOpen, onClose, defaultData, onCreate, onUpdate }: AddLectureProps) => {
  const { register, handleSubmit, setValue, watch } = useForm<CreateLecturePayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      lectureContent: defaultData?.lectureContent,
      lectureName: defaultData?.lectureName,
    },
  })

  const onSubmitHandler = (data: CreateLecturePayload) => {
    onUpdate &&
      onUpdate({ id: Number(defaultData?.id), lectureName: data.lectureName, lectureContent: data.lectureContent })
    onCreate && onCreate(data)
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
