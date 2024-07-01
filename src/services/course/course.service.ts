import axiosInstance from '../../axios'
import {
  AutoCompleteCourseQuery,
  CourseResponse,
  CoursesResponse,
  CreateCoursePayload,
  GetListCoursesQuery,
  GetMyCoursesQuery,
  UpdateCoursePayload,
} from './course.dto'

export const courseService = {
  autoComplete: async (query: AutoCompleteCourseQuery) => {
    const { data } = await axiosInstance.get<CoursesResponse>('/course/auto-complete', { params: { ...query } })

    return data.data
  },
  getCourseDetail: async (courseId: number) => {
    const { data } = await axiosInstance.get<CourseResponse>(`/course/retrieve/${courseId}`)

    return data.data
  },

  getCoursePublicDetail: async (courseId: number) => {
    const { data } = await axiosInstance.get<CourseResponse>(`/course/retrieve/public/${courseId}`)

    return data.data
  },

  getList: async (query: GetListCoursesQuery) => {
    const { data } = await axiosInstance.get<CoursesResponse>('/course/list', { params: { ...query } })

    return data.data
  },

  myCourse: async (query: GetMyCoursesQuery) => {
    const { data } = await axiosInstance.get<CoursesResponse>('/course/my-course', { params: { ...query } })

    return data.data
  },

  create: async (payload: CreateCoursePayload) => {
    const { data } = await axiosInstance.post<CourseResponse>('/course/create', payload)

    return data.data
  },

  update: async (payload: UpdateCoursePayload) => {
    const { data } = await axiosInstance.put('/course/update', payload)

    return data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`/course/delete/${id}`)
  },
}
