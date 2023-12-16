import axiosInstance from '@/axios'
import {
  CreateQuestionPayload,
  GetQuizListQuery,
  QuizListResponse,
  QuizQuestionResponse,
  UpdateQuestionPayload,
} from './quizQuestion.dto'

export const quizQuestionService = {
  getList: async (query?: GetQuizListQuery) => {
    const { data } = await axiosInstance.get<QuizListResponse>('/quiz-question/list', { params: { ...query } })

    return data.data.content
  },
  create: async (payload: CreateQuestionPayload) => {
    const { data } = await axiosInstance.post<QuizQuestionResponse>('/quiz-question/create', payload)

    return data.data
  },
  update: async (payload: UpdateQuestionPayload) => {
    const { data } = await axiosInstance.put<QuizQuestionResponse>('/quiz-question/update', payload)

    return data.data
  },
}
