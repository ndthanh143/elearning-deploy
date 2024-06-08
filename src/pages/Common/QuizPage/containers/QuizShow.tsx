import { AccessAlarm, ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { quizKey } from '@/services/quiz/quiz.query'
import { useAuth, useBoolean, useLocalStorage } from '@/hooks'
import { useEffect, useState } from 'react'
import { ConfirmPopup, Flex, Show } from '@/components'
import { generateAwnserKey } from '@/utils'
import { quizSubmissionService } from '@/services'
import Countdown from 'react-countdown'
import { Answer } from '../components'
import { QuizFinish } from '.'
import { xor } from 'lodash'
import { gray } from '@/styles/theme'

const Timer = ({
  isTeacher,
  quizTimer,
  limit,
  onComplete,
}: {
  isTeacher: boolean
  quizTimer: number
  limit: number
  onComplete: () => void
}) => {
  return (
    <Chip
      label={
        <Stack direction='row' alignItems='center' gap={1}>
          <AccessAlarm />
          <Countdown
            date={isTeacher ? 0 : quizTimer + limit * 60 * 1000}
            onComplete={() => !isTeacher && onComplete()}
          />
        </Stack>
      }
      variant='filled'
      color='primary'
    />
  )
}

export const QuizShow = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isTeacher } = useAuth()

  const { quizId, courseId, unitId } = useParams()

  const { setValue: setStatusQuiz } = useLocalStorage<boolean>('quizStarted', false)
  const { storedValue: quizTimer } = useLocalStorage('quiz-timer', Date.now())

  const { storedValue: quizSubmission, setValue: setQuizSubmission } = useLocalStorage<
    { questionId: number; answer: number[] }[]
  >('quiz', [])

  const [currentQuestionIndex, setCurrentQuestion] = useState(0)

  const { value: isOpenFinish, setTrue: openFinish } = useBoolean(false)

  const { value: isOpenConfirmSubmit, setTrue: openConfirmSubmit, setFalse: closeConfirmSubmit } = useBoolean(false)

  const quizInstance = quizKey.start({ courseId: Number(courseId), id: Number(quizId) })
  const { data } = useQuery(quizInstance)

  const { mutate: mutateSubmit, isPending: isLoadingSubmit } = useMutation({
    mutationFn: quizSubmissionService.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKey.details() })
      localStorage.clear()
      setStatusQuiz(false)
      openFinish()
    },
  })

  const handleNextQuestion = () => {
    data && setCurrentQuestion((prev) => (prev === data.questions.length - 1 ? 0 : prev + 1))
  }

  const handlePrevQuestion = () => {
    data && setCurrentQuestion((prev) => (prev === 0 ? data.questions.length - 1 : prev - 1))
  }

  const handleSubmit = () => {
    const results = quizSubmission.flatMap((item) => item.answer.map((answer) => ({ answerId: answer })))

    const totalTime = Date.now() - quizTimer
    mutateSubmit({ courseId: Number(courseId), unitId: Number(unitId), quizId: Number(quizId), results, totalTime })
  }

  const handleChooseQuestion = (questionId: number, answer: number) => {
    const filterValue = quizSubmission.filter((value) => value.questionId !== questionId)
    setQuizSubmission([...filterValue, { questionId, answer: [answer] }])
  }

  const handleChooseQuestionMultiple = (questionId: number, answer: number) => {
    const submissionValue = quizSubmission.find((value) => value.questionId === questionId)

    const filterValue = quizSubmission.filter((value) => value.questionId !== questionId)

    const currentAnswers = submissionValue?.answer || []

    const newAnswers = xor(currentAnswers, [answer])
    setQuizSubmission([...filterValue, { questionId, answer: newAnswers }])
  }

  const handleReview = () => {
    navigate(`/quiz-submission/`)
  }

  const checkAnswerChose = (anwserId: number) =>
    Boolean(quizSubmission.some((value) => value.answer.includes(anwserId)))

  useEffect(() => {
    if (quizSubmission && data && data.questions[currentQuestionIndex].questionType === 1) {
      handleNextQuestion()
    }
  }, [quizSubmission])

  return (
    data && (
      <Container maxWidth={'xl'} sx={{ my: 2 }}>
        <Show when={isOpenFinish}>
          <QuizFinish
            totalTime={Date.now() - quizTimer}
            totalAnwser={quizSubmission.length}
            totalQuestion={data.questions.length}
            onReview={handleReview}
          />
        </Show>
        <Grid container spacing={8} minHeight={700}>
          <Grid item xs={9}>
            <Card>
              <CardContent>
                {data.questions.length > 0 && (
                  <Stack gap={2}>
                    <Flex gap={1}>
                      <Chip label={currentQuestionIndex + 1} size='small' color='primary' />
                      <Typography>{data.questions[currentQuestionIndex].questionContent}</Typography>
                    </Flex>
                    <Box>
                      {data.questions[currentQuestionIndex].questionType === 2 && (
                        <Typography color={gray[800]} fontStyle='italic' variant='body1'>
                          Choose multiple answers
                        </Typography>
                      )}
                      <Stack gap={2} mt={1} mb='auto'>
                        {data.questions[currentQuestionIndex].answers.map((anwser, index) => (
                          <Answer
                            title={anwser.answerContent}
                            key={anwser.id}
                            label={generateAwnserKey(index)}
                            isChosen={checkAnswerChose(anwser.id)}
                            onClick={() =>
                              data.questions[currentQuestionIndex].questionType === 1
                                ? handleChooseQuestion(data.questions[currentQuestionIndex].id, anwser.id)
                                : handleChooseQuestionMultiple(data.questions[currentQuestionIndex].id, anwser.id)
                            }
                          />
                        ))}
                      </Stack>
                    </Box>
                    <Stack direction='row' gap={2} justifyContent='end' mt={2}>
                      <Button
                        variant='outlined'
                        onClick={handlePrevQuestion}
                        startIcon={<ArrowBackOutlined fontSize='small' />}
                      >
                        Previous
                      </Button>
                      <Button
                        variant='contained'
                        onClick={handleNextQuestion}
                        endIcon={<ArrowForwardOutlined fontSize='small' />}
                      >
                        Next
                      </Button>
                      {/* <Button variant='contained' onClick={openConfirmSubmit}>
                Submit
              </Button> */}
                    </Stack>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Flex justifyContent='end'>
              <Timer
                isTeacher={isTeacher}
                quizTimer={quizTimer}
                limit={data.quizTimeLimit}
                onComplete={openConfirmSubmit}
              />
            </Flex>
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack gap={1}>
                  <Flex justifyContent='start'>
                    <Typography variant='body2' fontWeight={700} color='primary'>
                      {quizSubmission.length}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        ...(quizSubmission.length === data.questions.length && {
                          color: 'primary.main',
                          fontWeight: 700,
                        }),
                      }}
                    >
                      /{data.questions.length}
                    </Typography>
                  </Flex>
                  <Slider
                    value={(quizSubmission.length / data.questions.length) * 100}
                    sx={{
                      py: 0,
                      height: 12,
                      '.MuiSlider-thumb': {
                        display: 'none',
                      },
                      '.MuiSlider-track': {
                        display: quizSubmission.length ? 'block' : 'none',
                      },
                    }}
                  />
                </Stack>
                <Divider />
                <Flex gap={1} flexWrap='wrap'>
                  {data.questions.map((question, index) => (
                    <Box
                      border={1}
                      borderRadius={2.4}
                      borderColor={currentQuestionIndex === index ? 'primary.main' : 'transparent'}
                      p={0.2}
                    >
                      <Chip
                        label={index + 1}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                        color={quizSubmission.some((value) => value.questionId === question.id) ? 'primary' : 'default'}
                        onClick={() => setCurrentQuestion(index)}
                      />
                    </Box>
                  ))}
                </Flex>
              </CardContent>
            </Card>
            <Button fullWidth variant='contained' sx={{ mt: 2 }} onClick={openConfirmSubmit} disabled={isTeacher}>
              {isTeacher ? 'Teacher can not submit' : 'Submit your answers'}
            </Button>
          </Grid>
        </Grid>
        <ConfirmPopup
          title='Confirm Submission'
          subtitle='Are you sure you want to submit your quiz test? Once submitted, you wont be able to make any changes.'
          isOpen={isOpenConfirmSubmit}
          onClose={closeConfirmSubmit}
          onAccept={handleSubmit}
          isLoading={isLoadingSubmit}
        />
      </Container>
    )
  )
}
