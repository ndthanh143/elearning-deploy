import { useAuth } from '@/hooks'
import { Button, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { array, boolean, number, object, string } from 'yup'
import { BasicInformation, CoursePlanSelection, NewsLetterSetting, TableStep } from '.'
import { yupResolver } from '@hookform/resolvers/yup'
import { Flex } from '@/components'
import { Course, CreateCoursePayload } from '@/services/course/course.dto'
import { DoNotDisturbAltOutlined, SaveOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface IFormCourseHandleProps {
  defaultValues?: Course
  handleSubmit: (payload: CreateCoursePayload) => void
}

const schema = object({
  courseName: string().required(),
  description: string().required(),
  requirements: array().of(string().required()).required(),
  objectives: array().of(string().required()).required(),
  thumbnail: string().required(),
  startDate: string().required(),
  teacherId: number().required(),
  state: number().required(),
  categoryId: number().required(),
  welcome: string(),
  congratulation: string(),
  lessonPlanId: number().required(),
  currency: string(),
  price: number(),
  isPublic: boolean(),
})

export type CreateCourseForm = UseFormReturn<
  {
    state: number
    teacherId: number
    objectives: string[]
    requirements: string[]
    courseName: string
    description: string
    thumbnail: string
    startDate: string
    currency?: string
    welcome?: string
    congratulation?: string
    price?: number
    categoryId: number
    lessonPlanId: number
    isPublic?: boolean
  },
  any,
  undefined
>

export function FormCourseHandle({ handleSubmit, defaultValues }: IFormCourseHandleProps) {
  const { profile } = useAuth()
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...(defaultValues
        ? {
            teacherId: defaultValues.teacherInfo.id || 0,
            state: defaultValues.state || 1,
            objectives: defaultValues.objectives,
            requirements: defaultValues.requirements,
            currency: defaultValues.currency,
            price: defaultValues.price,
            courseName: defaultValues.courseName || '',
            description: defaultValues.description || '',
            welcome: defaultValues.welcome,
            congratulation: defaultValues.congratulation,
            startDate: defaultValues.startDate,
            categoryId: defaultValues.categoryInfo?.id,
            thumbnail: defaultValues.thumbnail || '',
            lessonPlanId: defaultValues.lessonPlanInfo?.id,
            isPublic: defaultValues.isPublic,
          }
        : {
            ...(profile && {
              teacherId: profile.data.id,
            }),
            state: 1,
            objectives: [],
            requirements: [],
            currency: 'USD',
            isPublic: false,
          }),
    },
  })

  const onSubmitHandler = () => {
    const data = form.getValues()
    handleSubmit(data)
  }

  const steps = [
    <BasicInformation form={form} />,
    <CoursePlanSelection form={form} />,
    // <PriceConfig form={form} />,
    <NewsLetterSetting form={form} />,
  ]

  return (
    <Stack py={2} px={4} maxWidth='xl'>
      <Flex justifyContent='end' gap={2} mb={2}>
        <Button
          variant='outlined'
          onClick={() => navigate('/courses')}
          startIcon={<DoNotDisturbAltOutlined fontSize='small' />}
          size='large'
          color='secondary'
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={onSubmitHandler}
          startIcon={<SaveOutlined fontSize='small' />}
          size='large'
        >
          Save
        </Button>
      </Flex>
      <Grid spacing={4} alignItems='start' container>
        <Grid item xs={12} lg={3}>
          <TableStep step={step} onChange={setStep} />
        </Grid>
        <Grid item xs={12} lg={9}>
          <Flex gap={4}>{steps[step]}</Flex>
        </Grid>
      </Grid>
    </Stack>
  )
}
