import axiosInstance from '@/axios'
import { GetTopicsQuery, TopicsResponse } from './topic.dto'

export const topicService = {
  getAll: async (query?: GetTopicsQuery) => {
    const { data } = await axiosInstance.get<TopicsResponse>('/topic/list', { params: { ...query } })

    return data.data
  },
}
