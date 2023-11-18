import axiosInstance from '../../axios'
import { CourseResponse } from './course.dto'

export const courseService = {
  getCourseDetail: async (courseId: number) => {
    const { data } = await axiosInstance.get<CourseResponse>(`/course/retrieve/${courseId}`)

    return data
  },
}
