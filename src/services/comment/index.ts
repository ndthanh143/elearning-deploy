import axiosInstance from '@/axios'
import { CreateCommentPayload, GetCommentResponse, GetCommentsQuery, GetCommentsResponse } from './types'

export const commentService = {
  create: async (payload: CreateCommentPayload) => {
    const { data } = await axiosInstance.post<GetCommentResponse>('/comment/create', payload)
    return data
  },
  getList: async (query: GetCommentsQuery) => {
    const { data } = await axiosInstance.get<GetCommentsResponse>('/comment/list', { params: { ...query } })
    return data.data
  },
}
