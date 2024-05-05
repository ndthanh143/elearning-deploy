import { ConfirmPopup, ErrorField, Loading } from '@/components'
import { Quiz, UpdateQuizPayload } from '@/services/quiz/quiz.dto'
import { quizQuestionKey } from '@/services/quizQuestion/quizQuestion.query'
import { quizQuestionService } from '@/services/quizQuestion/quizQuestion.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Container, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { number, object, string } from 'yup'
import { CreateQuestion } from '.'
import { useBoolean } from '@/hooks'
import { CreateQuestionPayload, QuizQuestion, UpdateQuestionPayload } from '@/services/quizQuestion/quizQuestion.dto'
import { quizService } from '@/services/quiz/quiz.service'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { answerService } from '@/services/answer/answer.service'
import { moduleKey } from '@/services/module/module.query'

export type AddQuizProps = {
  isOpen?: boolean
  onClose: () => void
  defaultData?: Quiz
}

const schema = object({
  id: number().required(),
  quizTitle: string().required('Please fill quiz title').default('Quiz 1'),
  description: string(),
  quizTimeLimit: number().required(),
  startDate: string().required(),
  endDate: string().required(),
  attemptNumber: number().required(),
})

export const QuizActions = ({ isOpen = true, onClose, defaultData }: AddQuizProps) => {
  const queryClient = useQueryClient()

  const { value: isOpenAddQuestion, setFalse: closeAddQuestion, setTrue: openAddQuestion } = useBoolean(false)

  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null)
  const [selectedDeleteQuestion, setSelectedDeleteQuestion] = useState<number | null>(null)

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
  } = useForm<UpdateQuizPayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      id,
      quizTitle,
      description,
      attemptNumber,
      endDate: endDate ? dayjs(endDate).toISOString() : undefined,
      startDate: startDate ? dayjs(startDate).toISOString() : undefined,
      quizTimeLimit,
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
      // const newData = questions?.map((question) => (question.id === data.id ? data : question)) || []
      // queryClient.setQueryData(quizQuestionsInstance.queryKey, newData)

      refetchQuestions()
    },
  })

  const { mutate: mutateDeleteQuestion } = useMutation({
    mutationFn: quizQuestionService.delete,
    onSuccess: () => {
      setSelectedDeleteQuestion(null)
      const newData = questions?.filter((question) => question.id !== selectedDeleteQuestion) || []
      queryClient.setQueryData(quizQuestionsInstance.queryKey, newData)
    },
    onError: () => {
      toast.error('Can not delete this question, this quiz had submission before')
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
    <Box
      sx={{
        height: '100vh',
        width: isOpen ? '80%' : 0,
        position: 'absolute',
        overflowY: 'scroll',
        zIndex: 10,
        bgcolor: 'white',
        borderColor: '#ccc',
        boxShadow: 1,
        right: 0,
        bottom: 0,
        top: 0,
        transition: 'all 0.2s ease-in-out',
      }}
      // ref={notiRef}
    >
      <Container maxWidth='md' fixed>
        <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack gap={4} py={2}>
            <Stack>
              <Typography fontWeight={500}>Title</Typography>
              <TextField size='small' fullWidth {...register('quizTitle')} />
              <ErrorField isShow={Boolean(errors.quizTitle)} message={errors.quizTitle?.message} />
            </Stack>
            <Stack>
              <Typography fontWeight={500}>Description</Typography>
              <TextField size='small' fullWidth placeholder='Description' {...register('description')} />
              <ErrorField isShow={Boolean(errors.description)} message={errors.description?.message} />
            </Stack>

            <Stack direction='row' gap={2}>
              <Stack>
                <Typography fontWeight={500}>Start time</Typography>
                <DateTimePicker
                  defaultValue={getValues('startDate') && dayjs(getValues('startDate'))}
                  slotProps={{ textField: { size: 'small' } }}
                  onChange={(value) => {
                    setValue('startDate', dayjs(value).toISOString())
                  }}
                />
              </Stack>
              <Stack>
                <Typography fontWeight={500}>End time</Typography>
                <DateTimePicker
                  defaultValue={getValues('endDate') && dayjs(getValues('endDate'))}
                  slotProps={{ textField: { size: 'small' } }}
                  onChange={(value) => {
                    setValue('endDate', dayjs(value).toISOString())
                  }}
                />
              </Stack>
            </Stack>
            <Stack direction='row' gap={2}>
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
            </Stack>

            <Divider />
            {isLoadingQuestions && <Loading />}
            {questions &&
              questions?.map(
                (question) => (
                  <CreateQuestion
                    quizId={id}
                    defaultQuestion={question}
                    onClose={() => setSelectedQuestion(null)}
                    onUpdate={handleUpdateQuestion}
                    onDelete={mutateDeleteQuestion}
                    key={question.id}
                    status='view'
                  />
                ),
                // selectedQuestion === question ? (
                //   <CreateQuestion
                //     quizId={id}
                //     isOpen={selectedQuestion === question}
                //     defaultQuestion={selectedQuestion}
                //     onClose={() => setSelectedQuestion(null)}
                //     onUpdate={handleUpdateQuestion}
                //     key={question.id}
                //     status={selectedQuestion === question ? 'edit' : 'view'}
                //   />
                // ) : (
                //   <Box border={1} borderRadius={3} p={2} borderColor={gray[300]}>
                //     <Stack key={question.id} sx={{ widht: '100%' }}>
                //       <Stack>
                //         <Stack direction='row' gap={2}>
                //           <TextField size='small' fullWidth value={question.questionContent} />
                //           <Select size='small' value={question.questionType === 1 ? 'single' : 'multiple'}>
                //             <MenuItem value='multiple'>Multiple choice</MenuItem>
                //             <MenuItem value='single'>Single choice</MenuItem>
                //           </Select>
                //         </Stack>
                //       </Stack>
                //       <Stack gap={2} my={2}>
                //         {question.answers.map((anwser) => (
                //           <Stack direction='row' gap={2} alignItems='center'>
                //             <Tooltip title='Is correct'>
                //               <Radio checked={anwser.isCorrect} />
                //             </Tooltip>
                //             <TextField size='small' value={anwser.answerContent} fullWidth />
                //           </Stack>
                //         ))}
                //       </Stack>
                //     </Stack>
                //     <Stack direction='row' gap={2} justifyContent='end'>
                //       <Button onClick={() => setSelectedQuestion(question)}>Edit</Button>
                //       <Button onClick={() => setSelectedDeleteQuestion(question.id)} variant='outlined' color='error'>
                //         Delete
                //       </Button>
                //     </Stack>
                //   </Box>
                // ),
              )}
            {isOpenAddQuestion && (
              <CreateQuestion status='edit' quizId={id} onClose={closeAddQuestion} onSave={handleSaveQuestion} />
            )}
            <Button variant='outlined' onClick={openAddQuestion}>
              Add Question
            </Button>
          </Stack>
          <Divider />
          <Button variant='contained' type='submit' sx={{ my: 2 }} fullWidth>
            Save
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
