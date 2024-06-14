import axiosInstance from '@/axios'
import {
  CreateGroupTaskPayload,
  GetGroupTaskListQuery,
  GetGroupTaskResponse,
  GetListGroupTaskResponse,
  UpdateGroupTaskPayload,
} from './dto'

export const groupTaskService = {
  getListTask: async (query: GetGroupTaskListQuery) => {
    const { data } = await axiosInstance.get<GetListGroupTaskResponse>('group-task/list', { params: query })

    return data.data
  },
  create: async (payload: CreateGroupTaskPayload) => {
    const { data } = await axiosInstance.post<GetGroupTaskResponse>('group-task/create', payload)

    return data.data
  },
  update: async (payload: UpdateGroupTaskPayload) => {
    const { data } = await axiosInstance.put<GetGroupTaskResponse>('group-task/update', payload)
    return data.data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`group-task/delete/${id}`)
  },
}
