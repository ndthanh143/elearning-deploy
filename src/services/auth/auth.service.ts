import Cookies from 'js-cookie'

import { AuthLoginResponse, LoginAdminPayload, SignUpPayload } from './auth.dto'
import axiosInstance from '../../axios'

const BASE_AUTH_URL = 'auth'
const authService = {
  loginGoogle: async ({ type, accessToken }: { type: 'teacher' | 'student'; accessToken: string }) => {
    const routePath = type === 'student' ? 'student/google/verify-token' : 'teacher/google/verify-token'

    const { data } = await axiosInstance.post<AuthLoginResponse>(
      routePath,
      {},
      { headers: { 'X-Access-Token': accessToken } },
    )

    Cookies.set('access_token', data.data.access_token)

    return data
  },
  logout: () => {
    Cookies.remove('access_token')
    localStorage.clear()
  },
  loginAdmin: async (payload: LoginAdminPayload) => {
    const { data } = await axiosInstance.post<AuthLoginResponse>(`${BASE_AUTH_URL}/login`, payload)

    Cookies.set('access_token', data.data.access_token)

    return data
  },
  signUp: async ({ type, payload }: { type: 'teacher' | 'student'; payload: SignUpPayload }) => {
    const routePath = type === 'teacher' ? 'teacher/signup' : 'student/signup'
    const { data } = await axiosInstance.post<AuthLoginResponse>(routePath, payload)

    return data.data
  },
  login: async ({ type, payload }: { type: 'teacher' | 'student'; payload: LoginAdminPayload }) => {
    const routePath = type === 'teacher' ? 'teacher/login' : 'student/login'
    const { data } = await axiosInstance.post<AuthLoginResponse>(routePath, payload)

    Cookies.set('access_token', data.data.access_token)

    return data
  },
}

export default authService
