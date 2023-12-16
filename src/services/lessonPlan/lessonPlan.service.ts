import axiosInstance from '@/axios'
import { CreateLessonPlanPayload, GetLessonPlanQuery, LessonPlansResponse } from './lessonPlan.dto'

export const lessonPlanService = {
  getList: async (query: GetLessonPlanQuery) => {
    const { data } = await axiosInstance.get<LessonPlansResponse>('/lesson-plan/list', { params: { ...query } })

    return data.data
  },

  create: async (payload: CreateLessonPlanPayload) => {
    const { data } = await axiosInstance.post('/lesson-plan/create', payload)

    return data
  },
}
