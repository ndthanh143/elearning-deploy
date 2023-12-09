import { defineQuery } from '@/utils'
import { quizSubmissionService } from '.'

export const quizSubmissionKeys = {
  all: ['quiz-submission'] as const,
  reviews: () => [...quizSubmissionKeys.all, 'review'] as const,
  review: (quizSubmissionId: number) =>
    defineQuery([...quizSubmissionKeys.reviews(), quizSubmissionId], () =>
      quizSubmissionService.review(quizSubmissionId),
    ),
}
