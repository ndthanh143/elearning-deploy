import { ErrorField, Flex, Loading } from '@/components'
import { Quiz, UpdateQuizPayload } from '@/services/quiz/quiz.dto'
import { quizQuestionKey } from '@/services/quizQuestion/quizQuestion.query'
import { quizQuestionService } from '@/services/quizQuestion/quizQuestion.service'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { boolean, number, object, string } from 'yup'
import { QuestionBox } from '.'
import { useBoolean } from '@/hooks'
import { CreateQuestionPayload, QuizQuestion, UpdateQuestionPayload } from '@/services/quizQuestion/quizQuestion.dto'
import { quizService } from '@/services/quiz/quiz.service'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { answerService } from '@/services/answer/answer.service'
import { moduleKey } from '@/services/module/module.query'
import { AddOutlined, ArrowBackOutlined } from '@mui/icons-material'

export type AddQuizProps = {
  isOpen?: boolean
  onClose: () => void
  defaultData?: Quiz
}

const schema = object({
  id: number().required('ID is required'),
  quizTitle: string().required('Please fill in the quiz title').default('Quiz 1'),
  description: string().required('Please enter a description for the quiz'),
  quizTimeLimit: number().required('Quiz time limit is required'),
  startDate: string().required('Start date is required'),
  endDate: string().required('End date is required'),
  attemptNumber: number().required('Number of attempts is required'),
  isPublicAnswer: boolean().required('Public answer setting is required'),
})

export const QuizActions = ({ isOpen = true, onClose, defaultData }: AddQuizProps) => {
  const queryClient = useQueryClient()

  const { value: isOpenAddQuestion, setFalse: closeAddQuestion, setTrue: openAddQuestion } = useBoolean(false)

  const [_, setSelectedQuestion] = useState<QuizQuestion | null>(null)

  const { id, quizTitle, description, attemptNumber, endDate, startDate, quizTimeLimit } = defaultData
    ? defaultData
    : {
        id: 0,
        quizTitle: '',
        description: '',
        attemptNumber: 0,
        endDate: null,
        startDate: null,
        quizTimeLimit: 0,
      }

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id,
      quizTitle,
      description,
      attemptNumber,
      endDate: dayjs(endDate).toISOString(),
      startDate: dayjs(startDate).toISOString(),
      quizTimeLimit,
      isPublicAnswer: true,
    },
  })

  const quizQuestionsInstance = quizQuestionKey.list({ quizId: id })
  const {
    data: questions,
    refetch: refetchQuestions,
    isLoading: isLoadingQuestions,
  } = useQuery({
    ...quizQuestionsInstance,
  })

  const { mutate: mutateUpdateQuiz } = useMutation({
    mutationFn: quizService.update,
    onSuccess: () => {
      onClose()
      toast.success('Update quiz successfully')
      queryClient.invalidateQueries({ queryKey: moduleKey.lists() })
    },
  })

  const { mutate: mutateAddQuestion } = useMutation({
    mutationFn: quizQuestionService.create,
    onSuccess: (data) => {
      queryClient.setQueryData(quizQuestionsInstance.queryKey, [...(questions || []), data])
      closeAddQuestion()
    },
  })

  const { mutate: mutateUpdateQuestion } = useMutation({
    mutationFn: quizQuestionService.update,
    onSuccess: () => {
      setSelectedQuestion(null)
      refetchQuestions()
    },
  })

  const { mutate: mutateCreateAnswers, data: anwsersCreated } = useMutation({
    mutationFn: answerService.bulkCreate,
  })

  const { mutate: mutateDeleteAnswers } = useMutation({
    mutationFn: answerService.delete,
    onError: () => {
      toast.error('This quiz have submission before, can not modified it')
    },
  })

  const onSubmitHandler = (data: UpdateQuizPayload) => {
    mutateUpdateQuiz({ ...data, quizTimeLimit: data.quizTimeLimit })
  }

  const handleSaveQuestion = (data: CreateQuestionPayload) => {
    mutateAddQuestion(data)
  }

  const handleUpdateQuestion = (data: UpdateQuestionPayload) => {
    const newAnwsers = data.answers.filter((answer) => !answer.id)
    const currentQuestion = questions?.find((item) => item.id === data.id)

    const dataAnswersId = data.answers.map((item) => item.id)

    const deletedAnwser = currentQuestion?.answers.filter((answer) => !dataAnswersId.includes(answer.id))

    if (deletedAnwser?.length) {
      mutateDeleteAnswers(deletedAnwser.map((item) => item.id))
    }

    if (newAnwsers.length) {
      mutateCreateAnswers({ questionId: data.id, answers: newAnwsers })
      const updateAnwsers = data.answers.filter((anwser) => Boolean(anwser.id) || deletedAnwser?.includes(anwser))
      mutateUpdateQuestion({ ...data, answers: [...updateAnwsers, ...(anwsersCreated || [])] })
    } else {
      mutateUpdateQuestion(data)
    }
  }

  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          height: '100vh',
          width: isOpen ? '100vw' : 0,
          position: 'fixed',
          opacity: isOpen ? 1 : 0,
          overflowY: 'scroll',
          zIndex: 10,
          bgcolor: 'white',
          borderColor: '#ccc',
          boxShadow: 1,
          inset: 0,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth='md' sx={{ my: 2 }}>
          <Button sx={{ display: 'flex', gap: 1 }} color='secondary' onClick={onClose}>
            <ArrowBackOutlined fontSize='small' /> Back
          </Button>
          <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
            <Grid container spacing={4} my={1}>
              <Grid item xs={12}>
                <Typography fontWeight={500}>Title</Typography>
                <TextField size='small' fullWidth {...register('quizTitle')} />
                <ErrorField isShow={Boolean(errors.quizTitle)} message={errors.quizTitle?.message} />
              </Grid>
              <Grid item xs={12}>
                <Flex>
                  <Typography fontWeight={500}>Answer Reviewable</Typography>
                  <Switch defaultChecked {...register('isPublicAnswer')} />
                </Flex>
              </Grid>
              <Grid item xs={12}>
                <Stack>
                  <Typography fontWeight={500}>Description</Typography>
                  <TextField
                    size='small'
                    fullWidth
                    placeholder='Description'
                    {...register('description')}
                    minRows={3}
                    multiline
                  />
                  <ErrorField isShow={Boolean(errors.description)} message={errors.description?.message} />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack>
                  <Typography fontWeight={500}>Start time</Typography>
                  <DateTimePicker
                    {...(getValues('startDate') && {
                      defaultValue: dayjs(getValues('startDate')),
                    })}
                    slotProps={{ textField: { size: 'small' } }}
                    onChange={(value) => {
                      setValue('startDate', dayjs(value).toISOString())
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack>
                  <Typography fontWeight={500}>End time</Typography>
                  <DateTimePicker
                    {...(getValues('endDate') && {
                      defaultValue: dayjs(getValues('endDate')),
                    })}
                    slotProps={{ textField: { size: 'small' } }}
                    onChange={(value) => {
                      setValue('endDate', dayjs(value).toISOString())
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack>
                  <Typography fontWeight={500}>Number attempt</Typography>
                  <TextField
                    size='small'
                    type='number'
                    placeholder='Description'
                    {...register('attemptNumber')}
                    InputProps={{ inputProps: { min: 0 }, sx: { width: 'fit-content' } }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack>
                  <Typography fontWeight={500}>Time limit</Typography>
                  <TextField
                    size='small'
                    type='number'
                    placeholder='Description'
                    {...register('quizTimeLimit')}
                    InputProps={{
                      inputProps: { min: 0 },
                      endAdornment: <InputAdornment position='end'>Mins</InputAdornment>,
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />
            <Stack width='100%' gap={4}>
              {isLoadingQuestions && <Loading />}
              {questions &&
                questions?.map((question) => (
                  <QuestionBox
                    quizId={id}
                    defaultQuestion={question}
                    onClose={() => setSelectedQuestion(null)}
                    onUpdate={handleUpdateQuestion}
                    key={question.id}
                    status='view'
                  />
                ))}
            </Stack>
            <Box my={4}>
              {isOpenAddQuestion && (
                <QuestionBox status='create' quizId={id} onClose={closeAddQuestion} onSave={handleSaveQuestion} />
              )}
            </Box>
            <Button variant='outlined' onClick={openAddQuestion} fullWidth>
              <AddOutlined />
              Add Question
            </Button>
            <Divider sx={{ my: 4 }} />
            <Button variant='contained' type='submit' sx={{ my: 2 }} fullWidth>
              Save
            </Button>
            <Divider sx={{ my: 4 }} />
          </Box>
        </Container>
      </Box>
    </Modal>
  )
}
