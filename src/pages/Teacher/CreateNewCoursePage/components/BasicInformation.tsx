import { Flex } from '@/components'
import { useBoolean } from '@/hooks'
import { UploadPopup } from '@/pages/Common/AssignmentPage/components'
import { categoryKeys } from '@/services/category/category.query'
import { UploadFileData } from '@/services/file/file.dto'
import { gray } from '@/styles/theme'
import { getAbsolutePathFile } from '@/utils'
import { Autocomplete, Box, Button, Card, CardContent, Chip, Grid, Stack, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { CreateCourseForm } from '.'

interface IBasicInformationProps {
  onNext?: () => void
  form: CreateCourseForm
}
export function BasicInformation({ form }: IBasicInformationProps) {
  const { register, setValue, watch, getValues } = form

  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean(false)

  const [requirementText, setRequirementText] = useState<string>('')
  const [objectiveText, setObjectiveText] = useState<string>('')

  const categoryInstance = categoryKeys.list()
  const { data } = useQuery(categoryInstance)

  const handleDeleteRequirement = (chip: string) => {
    const filter = watch('requirements')?.filter((item) => item !== chip)
    setValue('requirements', filter)
  }

  const handleDeleteObjective = (objective: string) => {
    const filter = watch('objectives')?.filter((item) => item !== objective)
    setValue('objectives', filter)
  }

  const handleUploadThumbnail = (data: UploadFileData) => {
    setValue('thumbnail', data.filePath)
    closeUpload()
  }

  return (
    <>
      <Box component='form'>
        <Stack gap={2}>
          <Stack>
            <Typography variant='h3' fontWeight={700}>
              Basic Information
            </Typography>
            <Typography variant='body2'>
              Please fill in the basic information of your course. Make sure to provide accurate and detailed
              information so that students can easily understand what your course is about.
            </Typography>
          </Stack>
          <Flex gap={2} alignItems='start'>
            <Stack>
              <Typography variant='body1' fontWeight={700} color='secondary.main' mb={1}>
                Course Name
              </Typography>
              <TextField size='small' placeholder='Insert your course name...' {...register('courseName')} />
              <Typography variant='caption' color={gray[500]}>
                Your title must not only be attention-grabbing and informative, but also optimized for searchability
              </Typography>
            </Stack>
            <Stack>
              <Typography variant='body1' fontWeight={700} color='secondary.main' mb={1}>
                Status
              </Typography>
              <Flex gap={1}>
                <Chip
                  label='Private'
                  color={!watch('isPublic') ? 'primary' : 'default'}
                  onClick={() => setValue('isPublic', false)}
                />
                <Chip
                  label='Public'
                  color={watch('isPublic') ? 'primary' : 'default'}
                  onClick={() => setValue('isPublic', true)}
                />
              </Flex>
            </Stack>
          </Flex>

          <Stack>
            <Typography variant='body1' fontWeight={700} color='secondary.main' mb={1}>
              Course Description
            </Typography>
            <TextField placeholder='Insert your description...' {...register('description')} multiline rows={4} />
            <Typography variant='caption' color={gray[500]}>
              Description must be at least 200 words long.
            </Typography>
          </Stack>
          <Stack>
            <Typography variant='body1' fontWeight={700} color='secondary.main' mb={1}>
              More informations
            </Typography>
            <Flex gap={4}>
              <DatePicker
                slotProps={{
                  textField: { size: 'small', label: 'Start Date' },
                }}
                defaultValue={getValues('startDate') ? dayjs(getValues('startDate')) : null}
                onChange={(value: dayjs.Dayjs | null) => setValue('startDate', dayjs(value).toISOString())}
              />

              <Autocomplete
                disablePortal
                id='combo-box-category'
                options={data || []}
                getOptionLabel={(option) => option.name}
                value={data?.find((item) => item.id == getValues('categoryId')) || null}
                onChange={(_, newValue) => newValue && setValue('categoryId', newValue.id)}
                sx={{ minWidth: 200 }}
                renderInput={(params) => <TextField {...params} label='Category' size='small' />}
              />
            </Flex>
          </Stack>
          <Stack>
            <Typography variant='body1' fontWeight={700} color='secondary.main' mb={1}>
              Course image
            </Typography>
            <Grid container spacing={4} alignItems='center'>
              <Grid item xs={6}>
                <Box
                  component='img'
                  src={
                    getValues('thumbnail')
                      ? getAbsolutePathFile(getValues('thumbnail'))
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbGFBskopBcfmfKt3gB11zHUsy1YtHh3TXEtMm57yVMQ&s'
                  }
                  sx={{ objectFit: 'cover', width: '100%', height: 300 }}
                  borderRadius={4}
                  overflow='hidden'
                  border={1}
                  borderColor='secondary.light'
                />
              </Grid>
              <Grid item xs={6}>
                <Stack gap={1}>
                  <Typography>
                    Upload course images here. To be accepted, images must meet course image quality standards .
                    Important instructions: 750x422 pixels; .jpg, .jpeg,. gif, or .png. and there is no text on the
                    image.
                  </Typography>
                  <Button variant='outlined' onClick={openUpload}>
                    {getValues('thumbnail') ? 'Change image' : 'Upload image'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
          <Stack>
            <Typography variant='body1' fontWeight={700} color='secondary.main' mb={1}>
              Course requirement
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Card
                  variant='outlined'
                  sx={{
                    minHeight: 180,
                    bgcolor: 'transparent',
                    ...(!watch('requirements')?.length
                      ? { display: 'flex', justifyContent: 'center', alignItems: 'center' }
                      : {}),
                  }}
                >
                  <CardContent sx={{}}>
                    <Flex height='100%' borderRadius={4} alignItems={'start'} gap={1} flexWrap='wrap'>
                      {watch('requirements')?.length ? (
                        watch('requirements')?.map((item, index) => (
                          <Chip onDelete={() => handleDeleteRequirement(item || '')} label={item} key={index} />
                        ))
                      ) : (
                        <Typography m='auto' color='secondary.light'>
                          Your requirements added will show here...
                        </Typography>
                      )}
                    </Flex>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Stack justifyContent='center' alignItems='center' gap={2}>
                  <Typography textAlign='center'>
                    Add your requirements for your course, this will make student can be awareness to following your
                    lesson.
                  </Typography>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    value={requirementText}
                    placeholder='Type requirement here...'
                    onChange={(e) => setRequirementText(e.target.value)}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      const requirements = [...(getValues('requirements') || []), requirementText]
                      setValue('requirements', requirements)
                      setRequirementText('')
                    }}
                    disabled={!requirementText}
                  >
                    Add
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          <Stack>
            <Typography variant='body1' fontWeight={700} color='secondary.main' mb={1}>
              Course objectives
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Card
                  variant='outlined'
                  sx={{
                    minHeight: 180,
                    bgcolor: 'transparent',
                    ...(!watch('objectives')?.length
                      ? { display: 'flex', justifyContent: 'center', alignItems: 'center' }
                      : {}),
                  }}
                >
                  <CardContent sx={{}}>
                    <Flex height='100%' borderRadius={4} alignItems={'start'} gap={1} flexWrap='wrap'>
                      {watch('objectives')?.length ? (
                        watch('objectives')?.map((item, index) => (
                          <Chip onDelete={() => handleDeleteObjective(item || '')} label={item} key={index} />
                        ))
                      ) : (
                        <Typography m='auto' color='secondary.light'>
                          Your objectives added will show here...
                        </Typography>
                      )}
                    </Flex>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Stack justifyContent='center' alignItems='center' gap={2}>
                  <Typography textAlign='center'>
                    Add your objectives for your course, this will make student can be awareness to following your
                    lesson.
                  </Typography>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    value={objectiveText}
                    placeholder='Type objectives here...'
                    onChange={(e) => setObjectiveText(e.target.value)}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      const objectives = [...(getValues('objectives') || []), objectiveText]
                      setValue('objectives', objectives)
                      setObjectiveText('')
                    }}
                    disabled={!objectiveText}
                  >
                    Add
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Box>
      <UploadPopup isOpen={isOpenUpload} onSubmit={handleUploadThumbnail} onClose={closeUpload} />
    </>
  )
}
