import { CustomModal, Show } from '@/components'
import { useBoolean } from '@/hooks'
import { Course, UpdateCoursePayload } from '@/services/course/course.dto'
import { courseService } from '@/services/course/course.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Chip, Divider, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { array, object, string } from 'yup'

export type ModalUpdateIntroProps = {
  data: Course
  isOpen: boolean
  onClose: () => void
}

const schema = object<UpdateCoursePayload>({
  description: string(),
  requirements: array().of(string()),
  objectives: array().of(string()),
})

export const ModalUpdateIntro = ({ isOpen, onClose, data }: ModalUpdateIntroProps) => {
  const { register, setValue, handleSubmit } = useForm<UpdateCoursePayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: data.description,
      objectives: data.objectives,
      requirements: data.requirements,
    },
  })

  const { value: isAddRequirement, setTrue: openAddRequirement } = useBoolean(false)
  const { value: isAddobjectives, setTrue: openAddobjectives } = useBoolean(false)

  const [requirements, setRequirements] = useState<string[]>(data.requirements)
  const [objectives, setObjectives] = useState<string[]>(data.objectives)

  const { mutate: mutateUpdateCourse } = useMutation({ mutationFn: courseService.update })

  const handleDeleteRequirement = (chip: string) => {
    const filter = requirements.filter((item) => item !== chip)
    setRequirements(filter)
  }

  const handleDeleteKey = (key: string) => {
    const filter = objectives.filter((item) => item !== key)
    setObjectives(filter)
  }

  const onSubmitHandler = (data: UpdateCoursePayload) => {
    mutateUpdateCourse(data)
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title='Update intro course'>
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack my={4} gap={2}>
          <TextField placeholder='Description' {...register('description')} multiline rows={4} />

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
        </Stack>
        <Divider />
        <Stack direction='row' justifyContent='space-between' gap={4} mt={2}>
          <Button fullWidth variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth variant='contained' type='submit'>
            Update
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  )
}
