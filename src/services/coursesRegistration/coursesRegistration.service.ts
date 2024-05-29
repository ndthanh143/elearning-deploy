import axiosInstance from '../../axios'
import { CoureseRegistrationResponse, EnrollPayload, GetListStudentCourseQuery } from './coursesRegistration.dto'

export const coursesRegistrationService = {
  getCoursesRegistrationStudent: async (query: GetListStudentCourseQuery) => {
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
