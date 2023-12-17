import axiosInstance from '@/axios'
import {
  GetQuizSubmissionsQuery,
  QuizSubmissionPayload,
  QuizSubmissionReviewReponse,
  QuizSubmissionsReviewReponse,
} from './dto'

export const quizSubmissionService = {
  getList: async (query: GetQuizSubmissionsQuery) => {
    const { data } = await axiosInstance.get<QuizSubmissionsReviewReponse>('quiz-submission/list', {
      params: { ...query },
    })
    return data.data
  },
  submit: async (payload: QuizSubmissionPayload) => {
    const { data } = await axiosInstance.post('quiz-submission/submit', payload)

    return data
  },
  review: async (quizSubmissionId: number) => {
    const { data } = await axiosInstance.get<QuizSubmissionReviewReponse>(`quiz-submission/review/${quizSubmissionId}`)

    return data.data
  },
}
