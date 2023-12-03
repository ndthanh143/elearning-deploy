import Cookies from 'js-cookie'

import { AuthGoogleLoginResponse } from './auth.dto'
import axiosInstance from '../../axios'

const BASE_AUTH_UR = 'auth'
const authService = {
  loginGoogle: async (accessToken: string) => {
    const { data } = await axiosInstance.post<AuthGoogleLoginResponse>(
      `${BASE_AUTH_UR}/google?accessToken=${accessToken}`,
    )

    Cookies.set('access_token', data.data.token)

    return data
  },
  logout: () => {
    Cookies.remove('access_token')
    localStorage.clear()
  },
}

export default authService
