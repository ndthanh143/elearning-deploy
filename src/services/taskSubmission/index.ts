import axiosInstance from '@/axios'
import { GetListSubmissionResponse } from './dto'

export const taskSubmissionService = {
  getListSubmission: async (query: { groupTaskId: number }) => {
    const { data } = await axiosInstance.get<GetListSubmissionResponse>('task-submission/list', { params: query })
    return data.data as GetListSubmissionResponse['data']
  },
  submit: async (payload: { fileUrl: string; groupTaskId: number }) => {
    return axiosInstance.post('task-submission/submit', payload)
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`task-submission/delete/${id}`)
  },
}
