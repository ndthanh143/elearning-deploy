import { CustomModal, YoutubeCard } from '@/components'
import Editor from '@/components/Editor'
import { UrlPopup } from '@/components/UrlPopup'
import { useBoolean } from '@/hooks'
import { FileCard, UploadPopup } from '@/pages/AssignmentPage/components'
import { Assignment, CreateAssignmentPayload, UpdateAssignmentPayload } from '@/services/assignment/assignment.dto'
import { UploadFileData } from '@/services/file/file.dto'
import { getAbsolutePathFile, parseYoutubeUrlToEmbed } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { FileUploadOutlined, YouTube } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
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
}

const schema = object({
  assignmentContent: string().required(),
  assignmentTitle: string().required(),
  endDate: string(),
  startDate: string(),
  state: number().required(),
  urlDocument: string(),
})
export const AssignmentActions = ({ isOpen, onClose, defaultData, onCreate, onUpdate }: AddAssignmentProps) => {
  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean(false)
  const { value: isOpenYoutube, setTrue: openYoutube, setFalse: closeYoutube } = useBoolean(false)

  const { register, handleSubmit, setValue, getValues, watch } = useForm<CreateAssignmentPayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      state: defaultData?.state || 1,
      urlDocument: defaultData?.urlDocument || '',
      assignmentContent: defaultData?.assignmentContent,
      assignmentTitle: defaultData?.assignmentTitle,
      startDate: dayjs(defaultData?.startDate).toISOString(),
      endDate: dayjs(defaultData?.endDate).toISOString(),
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

  const onSubmitHandler = (data: CreateAssignmentPayload) => {
    onCreate && onCreate(data)
    onUpdate && defaultData && onUpdate({ id: defaultData.id, ...data })
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={status === 'update' ? 'Update assignment' : 'Add assignment'}>
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)} maxHeight='80vh' sx={{ overflowY: 'scroll' }}>
        <Stack gap={3} my={3}>
          <TextField size='small' placeholder='Title' fullWidth {...register('assignmentTitle')} />
          <Stack direction='row' gap={3}>
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
          {renderReviewResource()}
          <Stack direction='row' gap={2}>
            <Tooltip title='Add video on Youtube' onClick={openYoutube}>
              <IconButton size='large' sx={{ border: 1 }}>
                <YouTube fontSize='large' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Upload your file' onClick={openUpload}>
              <IconButton size='large' sx={{ border: 1 }}>
                <FileUploadOutlined fontSize='large' />
              </IconButton>
            </Tooltip>
          </Stack>
          <Box pb={4}>
            <Typography fontWeight={500} mb={1}>
              Content
            </Typography>
            <Editor
              value={watch('assignmentContent')}
              onChange={(value) => {
                setValue('assignmentContent', value)
              }}
            />
          </Box>
        </Stack>
        <Stack direction='row' gap={2} pb={2}>
          <Button variant='outlined' fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' fullWidth type='submit'>
            {status === 'update' ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Box>
      <UrlPopup
        placeholder='Fill your youtube URL'
        onClose={closeYoutube}
        isOpen={isOpenYoutube}
        onSubmit={handleSubmitYoutube}
      />
      <UploadPopup isOpen={isOpenUpload} onClose={closeUpload} onSubmit={handleSubmitUpload} />
    </CustomModal>
  )
}
