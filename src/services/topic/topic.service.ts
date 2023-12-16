import axiosInstance from '@/axios'
import { CreateTopicPayload, GetTopicsQuery, TopicResponse, TopicsResponse } from './topic.dto'

export const topicService = {
  getAll: async (query?: GetTopicsQuery) => {
    const { data } = await axiosInstance.get<TopicsResponse>('/topic/list', { params: { ...query } })

    return data.data.content
  },
  create: async (payload: CreateTopicPayload) => {
    const { data } = await axiosInstance.post<TopicResponse>('/topic/create', payload)

    return data.data
  },
}
