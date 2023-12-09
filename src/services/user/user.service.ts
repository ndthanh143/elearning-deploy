import axiosInstance from '../../axios'
import { RelativeMemberReponse, ScheduleResponse, UserResponse } from './user.dto'

const BASE_USER_URL = 'account'
export const userService = {
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
