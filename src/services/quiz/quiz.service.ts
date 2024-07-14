import axiosInstance from '@/axios'
import {
  CreateQuizPayload,
  CreateQuizWithUnitPayload,
  GetListQuizQuery,
  GetQuizDetailParams,
  GetQuizScheduleQuery,
  GetQuizScheduleResponse,
  GetQuizStartQuery,
  QuizResponse,
  QuizStartResponse,
  QuizzesResponse,
  UpdateQuizPayload,
} from './quiz.dto'
import { unitService } from '../unit'

export const quizService = {
  getList: async (query: GetListQuizQuery) => {
    const { data } = await axiosInstance.get<QuizzesResponse>('/quiz/list', { params: { ...query } })
    return data.data
  },
  getDetail: async (params: GetQuizDetailParams) => {
    const { quizId, ...query } = params
    const { data } = await axiosInstance.get<QuizResponse>(`/quiz/retrieve/${quizId}`, {
      params: {
        ...query,
      },
    })

    return data.data
  },
  getSchedule: async ({ startDate, endDate }: GetQuizScheduleQuery) => {
    const { data } = await axiosInstance.get<GetQuizScheduleResponse>('quiz/schedule', {
      params: { startDate, endDate },
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
  createWithUnit: async (payload: CreateQuizWithUnitPayload) => {
    const { lessonPlanId, parentId, startDate, endDate, position, ...props } = payload
    const { data } = await axiosInstance.post<QuizResponse>('/quiz/create', props)

    await unitService.create({
      lessonPlanId,
      parentId,
      startDate,
      endDate,
      quizId: data.data.id,
      name: data.data.quizTitle,
      position,
    })

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
