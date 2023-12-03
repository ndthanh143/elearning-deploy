import axiosInstance from '../../axios'
import { CoureseRegistrationResponse, getListStudentCourseQuery } from './coursesRegistration.dto'

export const coursesRegistrationService = {
  getCoursesRegistrationStudent: async (query: getListStudentCourseQuery) => {
    const { data } = await axiosInstance.get<CoureseRegistrationResponse>('/course-registration/list', {
      params: {
        ...query,
      },
    })

    return data.data
  },
}
