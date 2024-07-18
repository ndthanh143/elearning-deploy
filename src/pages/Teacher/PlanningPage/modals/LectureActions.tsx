import { icons } from '@/assets/icons'
import { Dropzone, Flex, LoadingButton } from '@/components'
import Editor from '@/components/ContentEditor/ContentEditor'
import { UploadEnumType } from '@/services/file/file.dto'
import { fileService } from '@/services/file/file.service'
import { CreateLecturePayload, Lecture, UpdateLecturePayload } from '@/services/lecture/lecture.dto'
import { getAbsolutePathFile, getResourceType } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackRounded, DeleteRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
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
  const [file, setFile] = useState<File>()
  const { register, handleSubmit, setValue, watch, reset } = useForm<CreateLecturePayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      lectureContent: defaultData?.lectureContent,
      lectureName: defaultData?.lectureName,
    },
  })

  const { mutate: mutateUploadFile, isPending: isLoadingUploadFile } = useMutation({
    mutationFn: fileService.upload,
    onSuccess: (data) => {
      onSubmit({
        urlDocument: data.data.filePath,
        contentType: data.data.contentType,
        lectureContent: watch('lectureContent'),
        lectureName: watch('lectureName'),
      })
    },
  })

  const { mutate: mutateUploadVideo, isPending: isLoadingUploadVideo } = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: fileService.uploadVideoFile,
    onSuccess: (data) => {
      onSubmit({
        urlDocument: data.data.filePath,
        contentType: data.data.contentType,
        lectureContent: watch('lectureContent'),
        lectureName: watch('lectureName'),
      })
    },
  })
  const onSubmitHandler = (data: CreateLecturePayload) => {
    if (file) {
      if (file.type.includes('video')) {
        mutateUploadVideo({ file: file as any, type: UploadEnumType.VIDEO })
      } else {
        mutateUploadFile({ file: file as any, type: UploadEnumType.DOCUMENT })
      }
      return
    }

    onSubmit(data)
  }

  const onSubmit = (data: CreateLecturePayload) => {
    onUpdate && onUpdate({ id: Number(defaultData?.id), ...data })
    onCreate && onCreate(data)
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  const isVideo = file?.type.includes('video')
  const videoSrc = getAbsolutePathFile(defaultData?.urlDocument || '')

  console.log('defaultData?.urlDocument', defaultData)

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

            <Stack gap={0.5}>
              <Typography fontWeight={700} variant='body2'>
                Resources
              </Typography>

              {!file && <Dropzone onFileChange={setFile} />}
              {file && (
                <Box mt={2}>
                  <Button
                    endIcon={<DeleteRounded color='error' fontSize='small' />}
                    variant='outlined'
                    color='error'
                    sx={{ mb: 2 }}
                    onClick={() => setFile(undefined)}
                  >
                    Remove file
                  </Button>
                  {(isVideo || defaultData?.urlDocument?.includes('VIDEO')) && (
                    <Box component='video' borderRadius={4} width='100%' controls>
                      <source
                        src={URL.createObjectURL(file) || videoSrc}
                        type={file ? 'video/mp4' : 'application/x-mpegURL'}
                      />
                      Your browser does not support the video tag.
                    </Box>
                  )}
                  {!isVideo && (
                    <Card variant='outlined'>
                      <CardContent>
                        <Flex gap={2} position='relative'>
                          <Box component='img' src={getResourceType(file.name)} width={50} height={50} />
                          <Stack gap={0.5} mr={4}>
                            <Typography fontWeight={600}>{file.name}</Typography>
                            <Typography>{(file.size / 1024).toFixed(1)}KB</Typography>
                          </Stack>
                          <Box position='absolute' right={0} top='50%' sx={{ transform: 'translateY(-50%)' }}>
                            <IconButton onClick={() => setFile(undefined)}>{icons['close']}</IconButton>
                          </Box>
                        </Flex>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}
            </Stack>

            <LoadingButton
              fullWidth
              variant='contained'
              type='submit'
              isLoading={isLoading || isLoadingUploadFile || isLoadingUploadVideo}
            >
              Submit
            </LoadingButton>
          </Box>
        </Container>
      </Box>
    </Modal>
  )
}
