import { Flex, LoadingButton } from '@/components'
import Editor from '@/components/ContentEditor/ContentEditor'
import { CreateLecturePayload, Lecture, UpdateLecturePayload } from '@/services/lecture/lecture.dto'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackRounded } from '@mui/icons-material'
import { Box, Button, Container, Modal, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

export type AddLectureProps = {
  isOpen: boolean
  defaultData?: Lecture
  onClose: () => void
  onCreate?: (payload: CreateLecturePayload) => void
  onUpdate?: (payload: UpdateLecturePayload) => void
  isLoading?: boolean
}

const schema = object({
  lectureContent: string().required(),
  lectureName: string().required(),
})

export const LectureActions = ({ isOpen, onClose, defaultData, onCreate, onUpdate, isLoading }: AddLectureProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<CreateLecturePayload>({
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

  const handleClose = () => {
    onClose()
    reset()
  }

  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          height: '100vh',
          width: isOpen ? '100vw' : 0,
          position: 'fixed',
          overflowY: 'scroll',
          opacity: isOpen ? 1 : 0,
          zIndex: 10,
          bgcolor: 'white',
          borderColor: '#ccc',
          boxShadow: 1,
          inset: 0,
          transition: 'all 0.3s ease-in',
        }}
        // ref={notiRef}
      >
        <Container maxWidth='lg' sx={{ py: 4 }}>
          <Flex>
            <Button startIcon={<ArrowBackRounded />} variant='text' onClick={handleClose}>
              Back
            </Button>
          </Flex>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmitHandler)}
            display='flex'
            flexDirection='column'
            gap={2}
            mt={2}
          >
            <Stack gap={0.5}>
              <Typography fontWeight={700} variant='body2'>
                Lecture name
              </Typography>
              <TextField
                placeholder='HTML & CSS Basics...'
                size='small'
                defaultValue={defaultData?.lectureName}
                fullWidth
                {...register('lectureName')}
                color='primary'
              />
            </Stack>
            <Stack gap={0.5}>
              <Typography fontWeight={700} variant='body2'>
                Course content
              </Typography>
              <Box minHeight={400}>
                <Editor
                  sx={{ minHeight: 400 }}
                  value={watch('lectureContent')}
                  onChange={(value) => {
                    setValue('lectureContent', value)
                  }}
                />
              </Box>
            </Stack>

            <LoadingButton fullWidth variant='contained' type='submit' isLoading={isLoading}>
              Submit
            </LoadingButton>
          </Box>
        </Container>
      </Box>
    </Modal>
  )
}
