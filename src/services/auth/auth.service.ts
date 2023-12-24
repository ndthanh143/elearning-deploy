import Cookies from 'js-cookie'

import { AuthLoginResponse, LoginAdminPayload } from './auth.dto'
import axiosInstance from '../../axios'

const BASE_AUTH_URL = 'auth'
const authService = {
  loginGoogle: async (accessToken: string) => {
    const { data } = await axiosInstance.post<AuthLoginResponse>(`${BASE_AUTH_URL}/google?accessToken=${accessToken}`)

    Cookies.set('access_token', data.data.token)

    return data
  },
  logout: () => {
    Cookies.remove('access_token')
    localStorage.clear()
  },
  loginAdmin: async (payload: LoginAdminPayload) => {
    const { data } = await axiosInstance.post<AuthLoginResponse>(`${BASE_AUTH_URL}/login`, payload)

    Cookies.set('access_token', data.data.token)

    return data
  },
}

export default authService
