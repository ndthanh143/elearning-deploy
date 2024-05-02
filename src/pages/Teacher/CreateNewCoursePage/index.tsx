import { LoadingOverlay } from '@/components'
import { useAuth } from '@/hooks'
import { courseKeys } from '@/services/course/course.query'
import { courseService } from '@/services/course/course.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowBackOutlined } from '@mui/icons-material'
import { Button, Container, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { array, number, object, string } from 'yup'
import { BasicInformation, CoursePlanSelection, NewsLetterSetting, PriceConfig } from './components'

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
  welcome: string(),
  congratulation: string(),
  planId: number(),
  currency: string(),
  price: number(),
})

export type CreateCourseForm = UseFormReturn<
  {
    requirements?: string[]
    objectives?: string[]
    state: number
    teacherId: number
    courseName: string
    description: string
    thumbnail: string
    startDate: string
    welcome?: string
    congratulation?: string
    lessonPlanId?: number
    currency?: string
    price?: number
    categoryId: number
  },
  any,
  undefined
>

export function CreateNewCoursePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState(0)

  const { profile } = useAuth()
  const form = useForm<CreateCourseForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...(profile && {
        teacherId: profile.data.id,
      }),
      state: 1,
      objectives: [],
      requirements: [],
      currency: 'USD',
    },
  })

  const { reset, getValues, watch } = form

  const { mutate: mutateCreateCourse, isPending: isLoadingCreate } = useMutation({
    mutationFn: courseService.create,
    onSuccess: (data) => {
      toast.success('Create course successfully!')
      // navigate(`/courses/${data.id}`)
      reset()
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })

  const handleSubmit = () => {
    const payload = getValues()

    mutateCreateCourse(payload)
  }

  const handleBack = () => {
    if (step === 0) {
      navigate('/courses')
    } else {
      setStep((prev) => prev - 1)
    }
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
  }

  console.log('watch', watch())

  const steps = [
    <BasicInformation onNext={handleNextStep} form={form} />,
    <CoursePlanSelection onNext={handleNextStep} form={form} />,
    <PriceConfig onNext={handleNextStep} form={form} />,
    <NewsLetterSetting form={form} onSubmit={handleSubmit} />,
  ]

  return (
    <>
      <Container maxWidth='lg'>
        <Button color='secondary' sx={{ py: 1 }} onClick={handleBack}>
          <ArrowBackOutlined fontSize='small' />
          <Typography variant='body2' mx={2}>
            Back
          </Typography>
        </Button>
        {steps[step]}
      </Container>
      <LoadingOverlay isOpen={isLoadingCreate} title='Creating your class...' />
    </>
  )
}
