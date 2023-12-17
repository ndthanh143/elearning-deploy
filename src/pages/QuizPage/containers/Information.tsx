import { BoxContent, PageContentHeading, Show } from '@/components'
import { useBoolean, useLocalStorage } from '@/hooks'
import { quizKey } from '@/services/quiz/quiz.query'
import { gray } from '@/styles/theme'
import { formatDate } from '@/utils'
import { ArrowBack } from '@mui/icons-material'
import { Button, Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ModalAttempts } from '../components'

export const Information = () => {
  const navigate = useNavigate()

  const { quizId, courseId } = useParams()

  const { setValue } = useLocalStorage<boolean>('quizStarted', false)
  const { setValue: setQuizTimer } = useLocalStorage('quiz-timer', Date.now())

  const { value: isOpenAttempts, setTrue: openAttempts, setFalse: closeAttempts } = useBoolean(false)

  const quizInstance = quizKey.detail(Number(quizId), Number(courseId))
  const { data: quiz } = useQuery(quizInstance)

  const handleStartQuiz = () => {
    if (quiz) {
      setValue(true)
      setQuizTimer(Date.now())
    }
  }

  const handleBack = () => {
    navigate(`/courses/${courseId}`)
  }

  const highestScore = quiz?.quizSubmissionInfo.reduce((maxScore, submission) => {
    return submission.score > maxScore ? submission.score : maxScore
  }, 0)

  return (
    quiz && (
      <>
        <Button sx={{ gap: 1, mb: 1 }} color='secondary' onClick={handleBack}>
          <ArrowBack />
          Back
        </Button>
        <PageContentHeading title={quiz.modulesInfo.modulesName} subTitle={quiz.modulesInfo.description} />
        <BoxContent display='flex' flexDirection='column' gap={2}>
          <Stack alignItems='center' gap={1}>
            <Typography variant='h5'>{quiz.quizTitle}</Typography>
            <Typography textAlign='center' color={gray[800]}>
              {quiz.description}
            </Typography>
            <Divider sx={{ width: '100%' }} />
            <Stack direction='row' gap={1}>
              <Typography>Total time:</Typography>
              <Typography fontWeight={500}>{quiz.quizTimeLimit} minutes</Typography>
            </Stack>
            <Stack direction='row' gap={1}>
              <Typography>Allow Attempts:</Typography>
              <Typography fontWeight={500}>{quiz.attemptNumber ? quiz.attemptNumber : 'No limit'}</Typography>
            </Stack>
            <Stack direction='row' gap={1}>
              <Typography>Open:</Typography>
              <Typography fontWeight={500}>{formatDate.toDateTime(quiz.startDate)}</Typography>
            </Stack>
            <Stack direction='row' gap={1}>
              <Typography>Close:</Typography>
              <Typography fontWeight={500}>{formatDate.toDateTime(quiz.endDate)}</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack alignItems='center'>
            {quiz.quizSubmissionInfo.length ? (
              <>
                <Typography>Highest Score: {highestScore?.toFixed(2)}</Typography>
                <Button
                  variant='text'
                  sx={{
                    ':hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={openAttempts}
                >
                  View your attempts
                </Button>
              </>
            ) : (
              <Typography>You haven't get attempt!</Typography>
            )}
          </Stack>
          {(!quiz.attemptNumber || quiz.quizSubmissionInfo.length < quiz.attemptNumber) && (
            <>
              <Divider />
              <Button variant='contained' onClick={handleStartQuiz} sx={{ my: 1 }}>
                Start Quiz
              </Button>
            </>
          )}
        </BoxContent>
        <Show when={isOpenAttempts}>
          <ModalAttempts data={quiz.quizSubmissionInfo} onClose={closeAttempts} />
        </Show>
      </>
    )
  )
}
