import axiosInstance from '@/axios'
import { ForumsResponse, GetForumsQuery } from './forum.dto'

export const forumService = {
  getForums: async (query?: GetForumsQuery) => {
    const { data } = await axiosInstance.get<ForumsResponse>('/forum/list', {
      params: { ...query },
    })

    return data.data
  },
}
