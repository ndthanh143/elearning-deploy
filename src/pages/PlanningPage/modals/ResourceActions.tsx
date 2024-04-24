import { CustomModal, ErrorField } from '@/components'
import { useBoolean } from '@/hooks'
import { FileCard, UploadPopup } from '@/pages/AssignmentPage/components'
import { UploadFileData } from '@/services/file/file.dto'
import { moduleKey } from '@/services/module/module.query'
import { CreateResourcePayload, Resource } from '@/services/resource/resource.dto'
import { resourceService } from '@/services/resource/resource.service'
import { getAbsolutePathFile } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { number, object, string } from 'yup'

export type AddResourceProps = { onClose: () => void; onCreate: (payload: CreateResourcePayload) => void } & (
  | {
      isOpen: boolean
      defaultData?: Resource
      status: 'create'
    }
  | { status: 'update'; defaultData: Resource; isOpen: boolean }
)

const schema = object({
  urlDocument: string().required(),
  title: string().required('Please fill resource name'),
})
export const ResourceActions = ({ isOpen, onClose, status, defaultData, onCreate }: AddResourceProps) => {
  const queryClient = useQueryClient()

  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    getValues,
  } = useForm<CreateResourcePayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: defaultData?.title,
      urlDocument: defaultData?.urlDocument,
    },
  })

  const { mutate: mutateUpdateResource } = useMutation({
    mutationFn: resourceService.update,
    onSuccess: () => {
      toast.success('Update resource successfully')
      onClose()
      reset()
      queryClient.invalidateQueries({ queryKey: moduleKey.lists() })
    },
  })

  const handleUpload = (data: UploadFileData) => {
    setValue('urlDocument', data.filePath)
    closeUpload()
  }

  const onSubmitHandler = (data: CreateResourcePayload) => {
    status === 'update' ? mutateUpdateResource({ id: defaultData.id, ...data }) : onCreate(data)
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={status === 'update' ? 'Update resource' : 'Add Resource'}
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
            {status === 'update' ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Box>
      <UploadPopup isOpen={isOpenUpload} onClose={closeUpload} onSubmit={handleUpload} />
    </CustomModal>
  )
}
