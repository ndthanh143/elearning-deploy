import axiosInstance from '@/axios'
import Cookies from 'js-cookie'
import { ActivityResponse } from './dto'

export const activityService = {
  tracking: async (payload: { endTime: string; startTime: string }) => {
    const accessToken = Cookies.get('access_token')

    await axiosInstance.post('activity-log/tracking', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  getMyActivity: async (query: { fromDate: string; toDate: string }) => {
    const { data } = await axiosInstance.get<ActivityResponse>('activity-log/my-activity', {
      params: query,
    })

    return data.data.content
  },
}
