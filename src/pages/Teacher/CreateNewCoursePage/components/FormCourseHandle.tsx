import { useAuth } from '@/hooks'
import { Divider, Grid } from '@mui/material'
import { useState } from 'react'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { array, number, object, string } from 'yup'
import { BasicInformation, CoursePlanSelection, NewsLetterSetting, PriceConfig, TableStep } from '.'
import { yupResolver } from '@hookform/resolvers/yup'
import { Flex } from '@/components'
import { Course, CreateCoursePayload } from '@/services/course/course.dto'

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
  },
  any,
  undefined
>

export function FormCourseHandle({ handleSubmit, defaultValues }: IFormCourseHandleProps) {
  const { profile } = useAuth()
  const [step, setStep] = useState(0)

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
          }
        : {
            ...(profile && {
              teacherId: profile.data.id,
            }),
            state: 1,
            objectives: [],
            requirements: [],
            currency: 'USD',
          }),
    },
  })

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const onSubmitHandler = () => {
    const data = form.getValues()
    handleSubmit(data)
  }

  const steps = [
    <BasicInformation onNext={handleNextStep} form={form} />,
    <CoursePlanSelection onNext={handleNextStep} form={form} />,
    <PriceConfig onNext={handleNextStep} form={form} />,
    <NewsLetterSetting form={form} onSubmit={onSubmitHandler} />,
  ]

  return (
    <Grid spacing={2} alignItems='start' py={4} container>
      <Grid item xs={2}>
        <TableStep step={step} onChange={setStep} />
      </Grid>
      <Grid item xs={10}>
        <Flex gap={4}>
          <Divider orientation='vertical' variant='middle' flexItem />
          {steps[step]}
        </Flex>
      </Grid>
    </Grid>
  )
}
