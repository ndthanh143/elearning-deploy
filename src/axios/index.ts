import axios from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})

axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {}

  const accessToken = Cookies.get('access_token')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export default axiosInstance
