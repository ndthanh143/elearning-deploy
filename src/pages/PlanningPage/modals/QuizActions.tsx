import { ConfirmPopup, CustomModal, ErrorField, Loading } from '@/components'
import { Quiz, UpdateQuizPayload } from '@/services/quiz/quiz.dto'
import { quizQuestionKey } from '@/services/quizQuestion/quizQuestion.query'
import { quizQuestionService } from '@/services/quizQuestion/quizQuestion.service'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Radio,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { number, object, string } from 'yup'
import { CreateQuestion, UpdateQuestion } from '.'
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
  defaultData: Quiz
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

export const QuizActions = ({ isOpen = false, onClose, defaultData }: AddQuizProps) => {
  const queryClient = useQueryClient()

  const { value: isOpenAddQuestion, setFalse: closeAddQuestion, setTrue: openAddQuestion } = useBoolean(false)

  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null)
  const [selectedDeleteQuestion, setSelectedDeleteQuestion] = useState<number | null>(null)

  const { id, quizTitle, description, attemptNumber, endDate, startDate, quizTimeLimit } = defaultData
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
      endDate: dayjs(endDate).toISOString(),
      startDate: dayjs(startDate).toISOString(),
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
    <CustomModal isOpen={isOpen} onClose={onClose} title='Quiz'>
      <Box component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={2} py={2} maxHeight='80vh' sx={{ overflowY: 'scroll' }}>
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
                defaultValue={dayjs(getValues('startDate'))}
                slotProps={{ textField: { size: 'small' } }}
                onChange={(value) => {
                  setValue('startDate', dayjs(value).toISOString())
                }}
              />
            </Stack>
            <Stack>
              <Typography fontWeight={500}>End time</Typography>
              <DateTimePicker
                defaultValue={dayjs(getValues('endDate'))}
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
                InputProps={{ inputProps: { min: 0 } }}
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
            questions?.map((question, index) =>
              selectedQuestion === question ? (
                <UpdateQuestion
                  isOpen={selectedQuestion === question}
                  defaultQuestion={selectedQuestion}
                  onClose={() => setSelectedQuestion(null)}
                  onSave={handleUpdateQuestion}
                />
              ) : (
                <Stack key={question.id}>
                  <Stack direction='row' gap={2} justifyContent='center'>
                    <Button onClick={() => setSelectedQuestion(question)}>Edit</Button>
                    <Button onClick={() => setSelectedDeleteQuestion(question.id)} variant='outlined' color='error'>
                      Delete
                    </Button>
                  </Stack>

                  <Stack>
                    <Typography>Question {index + 1}</Typography>
                    <Stack direction='row' gap={2}>
                      <TextField size='small' fullWidth value={question.questionContent} />
                      <Select size='small' value={question.questionType === 1 ? 'single' : 'multiple'}>
                        <MenuItem value='multiple'>Multiple choice</MenuItem>
                        <MenuItem value='single'>Single choice</MenuItem>
                      </Select>
                    </Stack>
                  </Stack>
                  <Stack gap={2} my={2}>
                    {question.answers.map((anwser) => (
                      <Stack direction='row' gap={2} alignItems='center'>
                        <Tooltip title='Is correct'>
                          <Radio checked={anwser.isCorrect} />
                        </Tooltip>
                        <TextField size='small' value={anwser.answerContent} fullWidth />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ),
            )}
          <CreateQuestion
            quizId={id}
            isOpen={isOpenAddQuestion}
            onClose={closeAddQuestion}
            onSave={handleSaveQuestion}
          />
          <Button variant='outlined' onClick={openAddQuestion}>
            Add Question
          </Button>
        </Stack>
        <Divider />
        <Button variant='contained' type='submit' sx={{ my: 2 }} fullWidth>
          Save
        </Button>
      </Box>
      {selectedDeleteQuestion && (
        <ConfirmPopup
          isOpen={Boolean(selectedDeleteQuestion)}
          onClose={() => setSelectedDeleteQuestion(null)}
          onAccept={() => mutateDeleteQuestion(selectedDeleteQuestion)}
          title='Are you sure to delete this question'
          subtitle='This action can not be undo'
        />
      )}
    </CustomModal>
  )
}
