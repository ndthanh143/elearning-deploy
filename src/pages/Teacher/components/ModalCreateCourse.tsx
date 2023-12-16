import { CustomModal, Show } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { UploadPopup } from '@/pages/AssignmentPage/components'
import { categoryKeys } from '@/services/category/category.query'
import { courseKeys } from '@/services/course/course.query'
import { courseService } from '@/services/course/course.service'
import { UploadFileData } from '@/services/file/file.dto'
import { getAbsolutePathFile } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Box, Button, Chip, Divider, Stack, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { array, number, object, string } from 'yup'

const schema = object({
  courseName: string().required(),
  description: string().required(),
  requirements: array().of(string()),
  objectives: array().of(string()),
  thumbnail: string().required(),
  startDate: string().required(),
  teacherId: number().required(),
  state: number().required(),
  categoryId: number().required(),
})

export type ModalCreateCourseProps = {
  isOpen: boolean
  onClose: () => void
}
export const ModalCreateCourse = ({ isOpen, onClose }: ModalCreateCourseProps) => {
  const queryClient = useQueryClient()

  const { profile } = useAuth()
  const { register, setValue, getValues, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...(profile && {
        teacherId: profile.data.id,
      }),
      state: 1,
    },
  })

  const { value: isAddRequirement, setTrue: openAddRequirement } = useBoolean(false)
  const { value: isAddobjectives, setTrue: openAddobjectives } = useBoolean(false)
  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean(false)

  const [requirements, setRequirements] = useState<string[]>([])
  const [objectives, setObjectives] = useState<string[]>([])

  const categoryInstance = categoryKeys.list()
  const { data } = useQuery(categoryInstance)

  const { mutate: mutateCreateCourse } = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      toast.success('Create course successfully!')
      onClose()
      reset()
      setRequirements([])
      setObjectives([])
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })

  const handleDeleteRequirement = (chip: string) => {
    const filter = requirements.filter((item) => item !== chip)
    setRequirements(filter)
  }

  const handleDeleteKey = (key: string) => {
    const filter = objectives.filter((item) => item !== key)
    setObjectives(filter)
  }

  const onSubmitHandler = (data: any) => {
    mutateCreateCourse(data)
  }

  const handleUploadThumbnail = (data: UploadFileData) => {
    setValue('thumbnail', data.filePath)
    closeUpload()
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title='Create course' sx={{ overflowY: 'scroll' }}>
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack my={4} gap={2}>
          <TextField size='small' placeholder='Name' {...register('courseName')} />
          <TextField placeholder='Description' {...register('description')} multiline rows={4} />
          <Stack direction='row' gap={4}>
            <DatePicker
              slotProps={{ textField: { fullWidth: true, size: 'small', placeholder: 'Start date' } }}
              onChange={(value: any) => setValue('startDate', dayjs(value).toISOString())}
            />
            <Autocomplete
              disablePortal
              id='combo-box-category'
              options={data || []}
              getOptionLabel={(option) => option.name}
              onChange={(_, newValue) => newValue && setValue('categoryId', newValue.id)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label='Category' size='small' />}
            />
          </Stack>

          <Show when={!!requirements.length}>
            <Stack gap={1}>
              <Typography fontWeight={500}>Requirements</Typography>

              <Stack direction='row' flexWrap='wrap' gap={1}>
                {requirements.map((item, index) => (
                  <Chip onDelete={() => handleDeleteRequirement(item)} label={item} key={index} />
                ))}
              </Stack>
            </Stack>
          </Show>
          {isAddRequirement ? (
            <TextField
              variant='standard'
              size='small'
              placeholder='Add new requirement'
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  setRequirements((prev) => [...prev, e.target.value])
                  setValue('requirements', requirements)
                }
              }}
            />
          ) : (
            <Button variant='outlined' onClick={openAddRequirement}>
              Add new requirement
            </Button>
          )}

          <Show when={!!objectives.length}>
            <Stack gap={1}>
              <Typography fontWeight={500}>Objectives</Typography>
              <Stack direction='row' gap={1}>
                {objectives.map((key, index) => (
                  <Chip label={key} key={index} onDelete={() => handleDeleteKey(key)} />
                ))}
              </Stack>
            </Stack>
          </Show>
          {isAddobjectives ? (
            <TextField
              variant='standard'
              size='small'
              placeholder='Add new key of course'
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  setObjectives((prev) => [...prev, e.target.value])
                  setValue('objectives', objectives)
                }
              }}
            />
          ) : (
            <Button variant='outlined' onClick={openAddobjectives}>
              Add new key of course
            </Button>
          )}
          {getValues('thumbnail') ? (
            <Box
              component='img'
              src={getAbsolutePathFile(getValues('thumbnail'))}
              maxHeight={200}
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <Button variant='outlined' onClick={openUpload}>
              Upload thumbnail
            </Button>
          )}
        </Stack>
        <Divider />
        <Stack direction='row' gap={2} mt={2}>
          <Button variant='outlined' fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' fullWidth type='submit'>
            Create
          </Button>
        </Stack>
      </Box>
      <UploadPopup isOpen={isOpenUpload} onSubmit={handleUploadThumbnail} onClose={closeUpload} />
    </CustomModal>
  )
}
