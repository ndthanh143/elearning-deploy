import axiosInstance from '../../axios'
import { GetStudentsQuery, RelativeMemberReponse, ScheduleResponse, UserResponse, UsersResponse } from './user.dto'

const BASE_USER_URL = 'account'
export const userService = {
  getStudents: async (query: GetStudentsQuery) => {
    const { data } = await axiosInstance.get<UsersResponse>('/account/all-student', { params: { ...query } })

    return data.data
  },
  getCurrentUser: async () => {
    const { data } = await axiosInstance.get<UserResponse>(`${BASE_USER_URL}/me`)

    return data
  },
  getSchedule: async () => {
    const { data } = await axiosInstance.get<ScheduleResponse>(`${BASE_USER_URL}/my-schedule`)

    return data.data
  },
  getRelativeMember: async () => {
    const { data } = await axiosInstance.get<RelativeMemberReponse>(`${BASE_USER_URL}/member`)

    return data.data
  },
}
