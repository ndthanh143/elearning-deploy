import axiosInstance from '@/axios'
import { GetNotiQuery, NotificationsResponse } from './notification.dto'

export const notificationService = {
  getList: async (query: GetNotiQuery) => {
    const { data } = await axiosInstance.get<NotificationsResponse>('/notification/list', { params: { ...query } })

    return data.data.content
  },
  read: async () => {
    await axiosInstance.put('/notification/read-all')
  },
}
