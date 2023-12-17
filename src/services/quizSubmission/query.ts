import { defineQuery } from '@/utils'
import { quizSubmissionService } from '.'
import { GetQuizSubmissionsQuery } from './dto'

export const quizSubmissionKeys = {
  all: ['quiz-submission'] as const,
  lists: () => [...quizSubmissionKeys.all, 'review'] as const,
  list: (query: GetQuizSubmissionsQuery) =>
    defineQuery([...quizSubmissionKeys.lists(), query], () => quizSubmissionService.getList(query)),
  reviews: () => [...quizSubmissionKeys.all, 'review'] as const,
  review: (quizSubmissionId: number) =>
    defineQuery([...quizSubmissionKeys.reviews(), quizSubmissionId], () =>
      quizSubmissionService.review(quizSubmissionId),
    ),
}
