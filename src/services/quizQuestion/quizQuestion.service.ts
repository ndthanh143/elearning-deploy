import axiosInstance from '@/axios'
import { GetQuizListQuery, QuizListResponse } from './quizQuestion.dto'

export const quizQuestionService = {
  getList: async (query?: GetQuizListQuery) => {
    const { data } = await axiosInstance.get<QuizListResponse>('/quiz-question/list', { params: { ...query } })

    return data.data
  },
}
