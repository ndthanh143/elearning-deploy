import axiosInstance from '@/axios'
import { ForumResponse, ForumsResponse, GetForumsQuery } from './forum.dto'

export const forumService = {
  getForums: async (query?: GetForumsQuery) => {
    const { data } = await axiosInstance.get<ForumsResponse>('/forum/list', {
      params: { ...query },
    })

    return data.data
  },
  getForum: async (id: number) => {
    const { data } = await axiosInstance.get<ForumResponse>(`/forum/retrieve/${id}`)

    return data.data
  },
}
