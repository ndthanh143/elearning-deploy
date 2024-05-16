import axiosInstance from '@/axios'
import {
  CreateQuizPayload,
  GetListQuizQuery,
  GetQuizStartQuery,
  QuizResponse,
  QuizStartResponse,
  QuizzesResponse,
  UpdateQuizPayload,
} from './quiz.dto'

export const quizService = {
  getList: async (query: GetListQuizQuery) => {
    const { data } = await axiosInstance.get<QuizzesResponse>('/quiz/list', { params: { ...query } })
    return data.data
  },
  getQuiz: async (quizId: number, courseId?: number) => {
    const { data } = await axiosInstance.get<QuizResponse>(`/quiz/retrieve/${quizId}`, {
      params: {
        courseId,
      },
    })

    return data.data
  },
  getInStart: async (query: GetQuizStartQuery) => {
    const { data } = await axiosInstance.get<QuizStartResponse>('/quiz/start', {
      params: {
        ...query,
      },
    })

    return data.data
  },
  create: async (payload: CreateQuizPayload) => {
    const { data } = await axiosInstance.post<QuizResponse>('/quiz/create', payload)

    return data.data
  },
  update: async (payload: UpdateQuizPayload) => {
    const { data } = await axiosInstance.put<QuizResponse>('/quiz/update', payload)

    return data
  },
  delete: async (quizId: number) => {
    await axiosInstance.delete(`/quiz/delete/${quizId}`)
  },
}
