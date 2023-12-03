import axiosInstance from '@/axios'
import { CreateTopicCommentPayload, TopicCommentResponse, UpdateTopicCommentPayload } from './topicComment.dto'

export const topicCommentService = {
  create: async (payload: CreateTopicCommentPayload) => {
    const { data } = await axiosInstance.post<TopicCommentResponse>('/topic-comment/create', payload)

    return data.data
  },
  update: async (payload: UpdateTopicCommentPayload) => {
    const { data } = await axiosInstance.put('/topic-comment/update', payload)

    return data
  },
  delete: async (topicId: number) => {
    await axiosInstance.delete(`/topic-comment/delete/${topicId}`)
  },
}
