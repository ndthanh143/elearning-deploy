import { CustomModal, ErrorField } from '@/components'
import { useBoolean } from '@/hooks'
import { FileCard, UploadPopup } from '@/pages/Common/AssignmentPage/components'
import { UploadFileData } from '@/services/file/file.dto'
import { CreateResourcePayload, Resource, UpdateResourcePayload } from '@/services/resource/resource.dto'
import { getAbsolutePathFile } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'

export type AddResourceProps = {
  onClose: () => void
  onCreate?: (payload: CreateResourcePayload) => void
  onUpdate?: (payload: UpdateResourcePayload) => void
  isOpen: boolean
  defaultData?: Resource
}
const schema = object({
  urlDocument: string().required(),
  title: string().required('Please fill resource name'),
})
export const ResourceActions = ({ isOpen, onClose, defaultData, onCreate, onUpdate }: AddResourceProps) => {
  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: defaultData?.title || '',
      urlDocument: defaultData?.urlDocument || '',
    },
  })

  const handleUpload = (data: UploadFileData) => {
    setValue('urlDocument', data.filePath)
    closeUpload()
  }

  const onSubmitHandler = (data: CreateResourcePayload) => {
    onCreate && onCreate(data)
    onUpdate && defaultData && onUpdate({ id: defaultData.id, ...data })
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={onUpdate ? 'Update resource' : 'Add Resource'}
      sx={{ maxWidth: 500 }}
    >
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={2} py={2}>
          <Stack gap={1}>
            <TextField placeholder='Name' size='small' fullWidth {...register('title')} />
            <ErrorField isShow={!!errors.title} message={errors.title?.message} />
          </Stack>

          {getValues('urlDocument') ? (
            <Stack gap={2}>
              <FileCard filePath={getAbsolutePathFile(getValues('urlDocument')) || ''} />
              <Button fullWidth variant='text' onClick={openUpload}>
                Change
              </Button>
            </Stack>
          ) : (
            <Button fullWidth variant='outlined' onClick={openUpload}>
              Upload file
            </Button>
          )}
        </Stack>

        <Divider />
        <Stack mt={2} direction='row' gap={2}>
          <Button variant='outlined' onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant='contained' type='submit' fullWidth>
            {onUpdate ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Box>
      <UploadPopup isOpen={isOpenUpload} onClose={closeUpload} onSubmit={handleUpload} />
    </CustomModal>
  )
}
