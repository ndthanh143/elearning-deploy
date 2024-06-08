import { Box } from '@mui/material'

import { QuizInfo, QuizShow } from './containers'
import { useLocalStorage } from '@/hooks'

export const QuizPage = () => {
  const { storedValue: isStarted } = useLocalStorage<boolean>('quizStarted', false)

  return <Box>{!isStarted ? <QuizInfo /> : <QuizShow />}</Box>
}
