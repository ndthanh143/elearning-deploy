import axiosInstance from '@/axios'
import { GetQuizStartQuery, QuizResponse, QuizStartResponse } from './quiz.dto'

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
}
