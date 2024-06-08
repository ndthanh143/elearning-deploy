import axios from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
})

const notFoundUrls = new Set()

axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {}

  const accessToken = Cookies.get('access_token')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  // // Check if the URL is in the notFoundUrls set
  // if (notFoundUrls.has(config.url)) {
  //   // Cancel the request if the URL is in the notFoundUrls set
  //   return Promise.reject({ message: `Request to ${config.url} is canceled because it previously returned a 404.` })
  // }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 404) {
      // Add the URL to the notFoundUrls set if the response status is 404
      notFoundUrls.add(error.config.url)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
