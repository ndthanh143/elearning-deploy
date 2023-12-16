import axiosInstance from '@/axios'
import { CreateQuizPayload, GetQuizStartQuery, QuizResponse, QuizStartResponse, UpdateQuizPayload } from './quiz.dto'

export const quizService = {
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

    return data
  },
  update: async (payload: UpdateQuizPayload) => {
    const { data } = await axiosInstance.put<QuizResponse>('/quiz/update', payload)

    return data
  },
  delete: async (quizId: number) => {
    await axiosInstance.delete(`/quiz/delete/${quizId}`)
  },
}
