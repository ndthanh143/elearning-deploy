import axiosInstance from '../../axios'
import { unitService } from '../unit'
import {
  CreateLecturePayload,
  CreateLectureTrackingPayload,
  CreateLectureWithUnitPayload,
  GetLectureDetailParams,
  LectureResponse,
  UpdateLecturePayload,
} from './lecture.dto'

export const lectureService = {
  getById: async (params: GetLectureDetailParams) => {
    const { lectureId, ...query } = params
    const { data } = await axiosInstance.get<LectureResponse>(`/lecture/retrieve/${lectureId}`, {
      params: {
        ...query,
      },
    })
    return data.data
  },
  create: async (payload: CreateLecturePayload) => {
    const { data } = await axiosInstance.post<LectureResponse>('/lecture/create', payload)

    return data.data
  },
  createWithUnit: async (payload: CreateLectureWithUnitPayload) => {
    const { lessonPlanId, parentId, position, ...props } = payload
    const { data } = await axiosInstance.post<LectureResponse>('/lecture/create', props)

    await unitService.create({
      lessonPlanId,
      parentId,
      position,
      lectureId: data.data.id,
      name: data.data.lectureName,
    })

    return data.data
  },
  update: async (payload: UpdateLecturePayload) => {
    const { data } = await axiosInstance.put<LectureResponse>('/lecture/update', payload)

    return data.data
  },
  delete: async (lectureId: number) => {
    await axiosInstance.delete(`/lecture/delete/${lectureId}`)
  },
  createTracking: async (payload: CreateLectureTrackingPayload) => {
    await axiosInstance.post('/lecture-tracking/create', payload)
  },
}
