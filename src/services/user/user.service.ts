import axiosInstance from '../../axios'
import { UserResponse } from './user.dto'

const BASE_USER_URL = 'account'
export const userService = {
  getCurrentUser: async () => {
    const { data } = await axiosInstance.get<UserResponse>(`${BASE_USER_URL}/me`)

    return data
  },
}
