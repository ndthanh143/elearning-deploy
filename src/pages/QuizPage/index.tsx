import { Box } from '@mui/material'

import { Information, QuizShow } from './containers'
import { useLocalStorage } from '@/hooks'

export const QuizPage = () => {
  const { storedValue: isStarted } = useLocalStorage<boolean>('quizStarted', false)

  return <Box>{!isStarted ? <Information /> : <QuizShow />}</Box>
}
