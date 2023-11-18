import axiosInstance from '../../axios'
import { CoureseRegistrationResponse, getListStudentCourseQuery } from './coursesRegistration.dto'

export const coursesRegistrationService = {
  getCoursesRegistrationStudent: async ({ studentId }: getListStudentCourseQuery) => {
    const { data } = await axiosInstance.get<CoureseRegistrationResponse>('/course-registration/list', {
      params: {
        studentId,
      },
    })

    return data
  },
}
