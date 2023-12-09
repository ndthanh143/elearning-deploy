import { AccessAlarm, CheckCircle, Circle, RadioButtonChecked } from '@mui/icons-material'
import { Box, Button, Chip, Divider, Grid, Slider, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { quizKey } from '@/services/quiz/quiz.query'
import { useBoolean, useLocalStorage } from '@/hooks'
import { useEffect, useState } from 'react'
import { ConfirmPopup, Show } from '@/components'
import { generateAwnserKey } from '@/utils'
import { quizSubmissionService } from '@/services'
import Countdown from 'react-countdown'
import { Answer } from '../components'
import { QuizFinish } from '.'

export const QuizShow = () => {
  const navigate = useNavigate()

  const { quizId, courseId } = useParams()

  const { setValue: setStatusQuiz } = useLocalStorage<boolean>('quizStarted', false)
  const { storedValue: quizTimer } = useLocalStorage('quiz-timer', Date.now())

  const { storedValue: quizSubmission, setValue: setQuizSubmission } = useLocalStorage<
    { questionId: number; answer: number }[]
  >('quiz', [])

  const [currentQuestionIndex, setCurrentQuestion] = useState(0)

  const { value: isOpenFinish, setTrue: openFinish } = useBoolean(false)

  const { value: isOpenConfirmSubmit, setTrue: openConfirmSubmit, setFalse: closeConfirmSubmit } = useBoolean(false)

  const quizInstance = quizKey.start({ courseId: Number(courseId), id: Number(quizId) })
  const { data } = useQuery(quizInstance)

  const { mutate: mutateSubmit, isPending: isLoadingSubmit } = useMutation({
    mutationFn: quizSubmissionService.submit,
    onSuccess: () => {
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
    const results = quizSubmission.map((item) => ({ answerId: item.answer }))
    const totalTime = Date.now() - quizTimer
    mutateSubmit({ courseId: Number(courseId), quizId: Number(quizId), results, totalTime })
  }

  const handleChooseQuestion = (questionId: number, answer: number) => {
    const filterValue = quizSubmission.filter((value) => value.questionId !== questionId)
    setQuizSubmission([...filterValue, { questionId, answer: answer }])
  }

  const handleReview = () => {
    navigate(`/quiz-submission/`)
  }

  const checkAnswerChose = (anwserId: number) => Boolean(quizSubmission.some((value) => value.answer === anwserId))

  useEffect(() => {
    if (quizSubmission && data) {
      handleNextQuestion()
    }
  }, [quizSubmission])

  console.log('data', data)

  return (
    data && (
      <>
        <Show when={isOpenFinish}>
          <QuizFinish
            totalTime={Date.now() - quizTimer}
            totalAnwser={quizSubmission.length}
            totalQuestion={data.questions.length}
            onReview={handleReview}
          />
        </Show>
        <Grid container spacing={4} minHeight={700}>
          <Grid item xs={4}>
            <Box bgcolor='#fff' padding={3} borderRadius={3} height='100%'>
              <Typography fontWeight={500} variant='h6'>
                {data.quizTitle}
              </Typography>
              <Stack direction='row' alignItems='center' gap={2}>
                <Slider
                  value={(quizSubmission.length / data.questions.length) * 100}
                  sx={{
                    height: 15,
                    '.MuiSlider-thumb': {
                      display: 'none',
                    },
                    '.MuiSlider-track': {
                      display: quizSubmission.length ? 'block' : 'none',
                    },
                  }}
                />

                <Stack direction='row'>
                  <Typography fontWeight={700} color='primary'>
                    {quizSubmission.length}
                  </Typography>

                  <Typography
                    sx={{
                      ...(quizSubmission.length === data.questions.length && {
                        color: 'primary.main',
                        fontWeight: 700,
                      }),
                    }}
                  >
                    /{data.questions.length}
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                gap={1}
                sx={{
                  overflowY: 'auto',
                }}
                maxHeight={500}
              >
                {data.questions.map((question, index) => {
                  const isActivatingQuestion = currentQuestionIndex === index
                  return (
                    <Stack
                      direction='row'
                      alignItems='center'
                      justifyContent='space-between'
                      py={1}
                      gap={2}
                      sx={{
                        ':hover': {
                          cursor: !isActivatingQuestion ? 'pointer' : 'unset',
                        },
                      }}
                      onClick={() => setCurrentQuestion(index)}
                      key={question.id}
                    >
                      <Stack direction='row' gap={3}>
                        <Typography
                          sx={{
                            ...(isActivatingQuestion && {
                              fontWeight: 500,
                              color: 'primary.main',
                            }),
                          }}
                        >
                          {index + 1}.
                        </Typography>
                        <Typography
                          sx={{
                            ...(isActivatingQuestion && {
                              fontWeight: 500,
                              color: 'primary.main',
                            }),
                          }}
                        >
                          {question.questionContent}
                        </Typography>
                      </Stack>
                      {isActivatingQuestion ? (
                        <RadioButtonChecked color='primary' />
                      ) : quizSubmission.some((value) => value.questionId === question.id) ? (
                        <CheckCircle color='primary' />
                      ) : (
                        <Circle color='secondary' />
                      )}
                    </Stack>
                  )
                })}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box
              padding={3}
              bgcolor='#fff'
              borderRadius={3}
              height='100%'
              display='flex'
              flexDirection='column'
              px={10}
              gap={3}
            >
              <Box>
                <Chip
                  label={
                    <Stack direction='row' alignItems='center' gap={1}>
                      <AccessAlarm />
                      <Countdown date={quizTimer + data.quizTimeLimit * 60 * 1000} onComplete={handleSubmit} />
                    </Stack>
                  }
                  variant='outlined'
                />
              </Box>
              {data.questions.length > 0 && (
                <>
                  <Typography> {data.questions[currentQuestionIndex].questionContent}</Typography>
                  <Stack gap={2} mt={1} mb='auto'>
                    {data.questions[currentQuestionIndex].answers.map((anwser, index) => (
                      <Answer
                        title={anwser.answerContent}
                        key={anwser.id}
                        label={generateAwnserKey(index)}
                        isChosen={checkAnswerChose(anwser.id)}
                        onClick={() => handleChooseQuestion(data.questions[currentQuestionIndex].id, anwser.id)}
                      />
                    ))}
                  </Stack>
                </>
              )}
              <Divider />
              <Stack direction='row' gap={2} justifyContent='end'>
                <Button variant='outlined' onClick={handlePrevQuestion}>
                  Previous
                </Button>
                <Button variant='outlined' onClick={handleNextQuestion}>
                  Next Question
                </Button>
                <Button variant='contained' onClick={openConfirmSubmit}>
                  Submit
                </Button>
              </Stack>
            </Box>
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
      </>
    )
  )
}
