import { defineQuery } from '@/utils'
import { GetQuizListQuery } from './quizQuestion.dto'
import { quizQuestionService } from './quizQuestion.service'

export const quizQuestionKey = {
  all: ['quiz-question'] as const,
  lists: () => [...quizQuestionKey.all, 'list'] as const,
  list: (query?: GetQuizListQuery) =>
    defineQuery([...quizQuestionKey.lists(), query], () => quizQuestionService.getList(query)),
}
