import axiosInstance from '../../axios'
import { CoureseRegistrationResponse, EnrollPayload, getListStudentCourseQuery } from './coursesRegistration.dto'

export const coursesRegistrationService = {
  getCoursesRegistrationStudent: async (query: getListStudentCourseQuery) => {
    const { data } = await axiosInstance.get<CoureseRegistrationResponse>('/course-registration/list', {
      params: {
        ...query,
      },
    })

    return data.data
  },
  enroll: async (payload: EnrollPayload) => {
    const { data } = await axiosInstance.post('course-registration/enroll', payload)

    return data
  },
}
