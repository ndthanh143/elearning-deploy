import axiosInstance from '@/axios'
import { QuizSubmissionPayload, QuizSubmissionReviewReponse } from './dto'

export const quizSubmissionService = {
  submit: async (payload: QuizSubmissionPayload) => {
    const { data } = await axiosInstance.post('quiz-submission/submit', payload)

    return data
  },
  review: async (quizSubmissionId: number) => {
    const { data } = await axiosInstance.get<QuizSubmissionReviewReponse>(`quiz-submission/review/${quizSubmissionId}`)

    return data.data
  },
}
