import axiosInstance from '@/axios'
import { AnwsersResponse, CreateAnswerPayload } from './answer.dto'

export const answerService = {
  bulkCreate: async (payload: CreateAnswerPayload) => {
    const { data } = await axiosInstance.post<AnwsersResponse>('answer-question/create', payload)

    return data.data
  },
  delete: async (listId: number[]) => {
    const bulkDelete = listId.map((id) => axiosInstance.delete(`/answer-question/delete/${id}`))
    await Promise.all(bulkDelete)
  },
}
