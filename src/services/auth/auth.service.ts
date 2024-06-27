import Cookies from 'js-cookie'

import {
  AuthLoginResponse,
  LoginAdminPayload,
  RequestForgotPasswordPayload,
  RequestForgotPasswordResponse,
  ResetPasswordPayload,
  SignUpPayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from './auth.dto'
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
  requestForgotPassword: async (payload: RequestForgotPasswordPayload) => {
    const { data } = await axiosInstance.post<RequestForgotPasswordResponse>(`account/request-forgot-password`, payload)
    return data.data
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    console.log('verifyOtp', payload)
    const { data } = await axiosInstance.post<VerifyOtpResponse>(`account/verify-otp`, payload)
    return data.data
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    await axiosInstance.post(`account/forgot-password`, payload)
  },
}

export default authService
