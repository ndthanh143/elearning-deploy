import { icons } from '@/assets/icons'
import { Flex, LoadingButton, YoutubeCard } from '@/components'
import Editor from '@/components/ContentEditor/ContentEditor'
import { UrlPopup } from '@/components/UrlPopup'
import { useBoolean } from '@/hooks'
import { FileCard, UploadPopup } from '@/pages/Common/AssignmentPage/components'
import { Assignment, CreateAssignmentPayload, UpdateAssignmentPayload } from '@/services/assignment/assignment.dto'
import { UploadFileData } from '@/services/file/file.dto'
import { getAbsolutePathFile, parseYoutubeUrlToEmbed } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackRounded, FileUploadRounded } from '@mui/icons-material'
import { Box, Button, Container, IconButton, Modal, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { number, object, string } from 'yup'

export type AddAssignmentProps = {
  onClose: () => void
  onCreate?: (payload: CreateAssignmentPayload) => void
  onUpdate?: (payload: UpdateAssignmentPayload) => void
  isOpen: boolean
  defaultData?: Assignment
  status?: 'create' | 'update'
  isLoading?: boolean
}

const schema = object({
  assignmentContent: string().required(),
  assignmentTitle: string().required(),
  endDate: string(),
  startDate: string(),
  state: number().required(),
  urlDocument: string(),
})
export const AssignmentActions = ({
  isOpen,
  status = 'create',
  onClose,
  defaultData,
  onCreate,
  onUpdate,
  isLoading,
}: AddAssignmentProps) => {
  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean(false)
  const { value: isOpenYoutube, setTrue: openYoutube, setFalse: closeYoutube } = useBoolean(false)

  console.log('defaultData', defaultData)

  const { register, handleSubmit, setValue, getValues, watch } = useForm<CreateAssignmentPayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      state: defaultData?.state || 1,
      urlDocument: defaultData?.urlDocument || '',
      assignmentContent: defaultData?.assignmentContent,
      assignmentTitle: defaultData?.assignmentTitle,
      startDate: defaultData?.startDate ? dayjs(defaultData?.startDate).toISOString() : '',
      endDate: defaultData?.endDate ? dayjs(defaultData?.endDate).toISOString() : '',
    },
  })

  const handleSubmitUpload = (data: UploadFileData) => {
    setValue('urlDocument', data.filePath)
    closeUpload()
  }

  const handleSubmitYoutube = (url: string) => {
    setValue('urlDocument', parseYoutubeUrlToEmbed(url))
    closeYoutube()
  }

  const renderReviewResource = () => {
    const urlDocument = getValues('urlDocument')

    if (urlDocument) {
      const isYoutubeLink = urlDocument.includes('www.youtube.com')

      if (isYoutubeLink) {
        return <YoutubeCard videoUrl={urlDocument} />
      } else {
        return <FileCard filePath={getAbsolutePathFile(urlDocument) || ''} />
      }
    }
  }

  const handleClose = () => {
    onClose()
  }

  const onSubmitHandler = (data: CreateAssignmentPayload) => {
    onCreate && onCreate(data)
    onUpdate && defaultData && onUpdate({ id: defaultData.id, ...data })
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
          <Box component='form' onSubmit={handleSubmit(onSubmitHandler)} sx={{ overflowY: 'scroll' }}>
            <Stack gap={3} my={3}>
              <Stack gap={0.5}>
                <Typography variant='body1' fontWeight={600}>
                  Assignment title
                </Typography>
                <TextField size='small' placeholder='Title' fullWidth {...register('assignmentTitle')} />
              </Stack>
              <Stack direction='row' gap={3}>
                <Stack gap={0.5}>
                  <Typography variant='body1' fontWeight={600}>
                    Start date
                  </Typography>
                  <DatePicker
                    defaultValue={defaultData?.startDate && dayjs(getValues('startDate'))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        placeholder: 'Start date',
                      },
                    }}
                    disablePast
                    onChange={(value: any) => setValue('startDate', dayjs(value).toISOString())}
                  />
                </Stack>
                <Stack gap={0.5}>
                  <Typography variant='body1' fontWeight={600}>
                    End date
                  </Typography>
                  <DatePicker
                    disablePast
                    defaultValue={defaultData?.endDate && dayjs(getValues('endDate'))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        placeholder: 'End date',
                      },
                    }}
                    onChange={(value: any) => setValue('endDate', dayjs(value).toISOString())}
                  />
                </Stack>
              </Stack>
              <Stack gap={1}>
                <Typography fontWeight={600}>Resource</Typography>
                {renderReviewResource()}
                <Flex gap={2}>
                  <Tooltip title='Add video on Youtube' onClick={openYoutube}>
                    <IconButton size='large' sx={{ border: 1 }}>
                      {icons['youtube']}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Upload your file' onClick={openUpload}>
                    <IconButton size='large' sx={{ border: 1 }}>
                      <FileUploadRounded fontSize='large' color='primary' />
                    </IconButton>
                  </Tooltip>
                </Flex>
              </Stack>

              <Stack gap={0.5}>
                <Typography fontWeight={600}>Content</Typography>
                <Editor
                  value={watch('assignmentContent')}
                  onChange={(value) => {
                    setValue('assignmentContent', value)
                  }}
                />
              </Stack>
            </Stack>
            <Stack direction='row' gap={2} pb={2}>
              <Button variant='outlined' fullWidth onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <LoadingButton variant='contained' fullWidth type='submit' isLoading={isLoading}>
                {status === 'update' ? 'Update' : 'Create'}
              </LoadingButton>
            </Stack>
          </Box>
        </Container>

        <UrlPopup
          placeholder='Fill your youtube URL'
          onClose={closeYoutube}
          isOpen={isOpenYoutube}
          onSubmit={handleSubmitYoutube}
        />
        <UploadPopup isOpen={isOpenUpload} onClose={closeUpload} onSubmit={handleSubmitUpload} />
      </Box>
    </Modal>
  )
}
