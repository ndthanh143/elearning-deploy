import axiosInstance from '../../axios'
import {
  CourseResponse,
  CoursesResponse,
  CreateCoursePayload,
  GetListCoursesQuery,
  UpdateCoursePayload,
} from './course.dto'

export const courseService = {
  getCourseDetail: async (courseId: number) => {
    const { data } = await axiosInstance.get<CourseResponse>(`/course/retrieve/${courseId}`)

    return data.data
  },

  getList: async (query: GetListCoursesQuery) => {
    const { data } = await axiosInstance.get<CoursesResponse>('/course/list', { params: { ...query } })

    return data.data
  },

  create: async (payload: CreateCoursePayload) => {
    const { data } = await axiosInstance.post('/course/create', payload)

    return data
  },

  update: async (payload: UpdateCoursePayload) => {
    const { data } = await axiosInstance.put('/course/update', payload)

    return data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`/course/delete/${id}`)
  },
}
