import axiosInstance from '@/axios'
import { GetGroupCommentsQuery, GetListGroupCommentsResponse } from './types'

export const groupCommentService = {
  getList: async (query: GetGroupCommentsQuery) => {
    const { data } = await axiosInstance.get<GetListGroupCommentsResponse>('/group-comment/list', {
      params: { ...query },
    })

    return data.data
  },
}
