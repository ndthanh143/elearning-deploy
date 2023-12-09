import { defineQuery } from '@/utils'
import { quizService } from './quiz.service'
import { GetQuizStartQuery } from './quiz.dto'

export const quizKey = {
  all: ['quiz'] as const,
  details: () => [...quizKey.all, 'detail'] as const,
  detail: (quizId: number, courseId?: number) =>
    defineQuery([...quizKey.details(), quizId, courseId], () => quizService.getQuiz(quizId, courseId)),
  starts: () => [...quizKey.all, 'start'] as const,
  start: (query: GetQuizStartQuery) => defineQuery([...quizKey.starts(), query], () => quizService.getInStart(query)),
}
