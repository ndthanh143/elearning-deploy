import { CheckCircle, ErrorOutline } from '@mui/icons-material'
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import { generateAwnserKey } from '@/utils'
import { quizSubmissionKeys } from '@/services/quizSubmission/query'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Answer } from '../components'

export const QuizReview = () => {
  const { quizSubmissionId } = useParams()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const submissionInstance = quizSubmissionKeys.review(Number(quizSubmissionId))
  const { data } = useQuery(submissionInstance)

  const handleNextQuestion = () => {
    data && setCurrentQuestionIndex((prev) => (prev === data.questions.length - 1 ? 0 : prev + 1))
  }

  const handlePrevQuestion = () => {
    data && setCurrentQuestionIndex((prev) => (prev === 0 ? data.questions.length - 1 : prev - 1))
  }

  const correctCounts = data?.questions.reduce((acc, cur) => {
    return cur.answers.some((anwser) => anwser.isCorrect && anwser.isSelected) ? acc + 1 : acc
  }, 0)

  return (
    data && (
      <>
        <Grid container spacing={4} minHeight={700}>
          <Grid item xs={4}>
            <Box bgcolor='#fff' padding={3} borderRadius={3} height='100%'>
              <Stack direction='row' gap={1}>
                <Typography>Corrects/Question:</Typography>
                <Typography color='success.main' fontWeight={500}>
                  {correctCounts}/{data.questions.length}
                </Typography>
              </Stack>
              <Stack direction='row' gap={1}>
                <Typography>Scores:</Typography>
                <Typography color='success.main' fontWeight={500}>
                  {data.score.toFixed(2)}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                gap={1}
                sx={{
                  overflowY: 'auto',
                }}
                maxHeight='80vh'
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
                      onClick={() => setCurrentQuestionIndex(index)}
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
                      {question.answers.some((anwser) => anwser.isCorrect && anwser.isSelected) && (
                        <CheckCircle color='success' />
                      )}
                      {question.answers.some((anwser) => !anwser.isCorrect && anwser.isSelected) && (
                        <ErrorOutline color='error' />
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
              <Typography variant='h5' fontWeight={500}></Typography>
              <Typography> {data.questions[currentQuestionIndex].questionContent}</Typography>
              <Stack gap={2} mt={1} mb='auto'>
                {data.questions[currentQuestionIndex].answers.map((anwser, index) => (
                  <Answer
                    key={anwser.id}
                    title={anwser.answerContent}
                    label={generateAwnserKey(index)}
                    isCorrect={anwser.isCorrect && !anwser.isSelected}
                    isChosen={anwser.isSelected && anwser.isCorrect}
                    isError={anwser.isSelected && !anwser.isCorrect}
                  />
                ))}
              </Stack>
              <Divider />
              <Stack direction='row' gap={2} justifyContent='end'>
                <Button variant='outlined' onClick={handlePrevQuestion}>
                  Previous
                </Button>
                <Button variant='outlined' onClick={handleNextQuestion}>
                  Next Question
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </>
    )
  )
}
