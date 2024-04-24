import axiosInstance from '@/axios'
import {
  CreateLessonPlanPayload,
  GetLessonPlanQuery,
  LessonPlanResponse,
  LessonPlansResponse,
  UpdateLessonPlanPayload,
} from './lessonPlan.dto'

export const lessonPlanService = {
  getList: async (query: GetLessonPlanQuery) => {
    const { data } = await axiosInstance.get<LessonPlansResponse>('lesson-plan/list', { params: { ...query } })

    return data.data
  },

  create: async (payload: CreateLessonPlanPayload) => {
    const { data } = await axiosInstance.post<LessonPlanResponse>('lesson-plan/create', payload)

    return data.data
  },
  update: async (payload: UpdateLessonPlanPayload) => {
    const { data } = await axiosInstance.put('lesson-plan/update', payload)

    return data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`lesson-plan/delete/${id}`)
  },
}
