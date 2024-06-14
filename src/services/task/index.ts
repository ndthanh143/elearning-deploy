import axiosInstance from '@/axios'
import {
  CreateTaskPayload,
  GetTaskListQuery,
  GetTaskResponse,
  GetListTaskResponse,
  UpdateTaskPayload,
  RemoveTaskFromGroupPayload,
  ChangeTimeTaskForGroupPayload,
} from './dto'

export const taskService = {
  getListTask: async (query: GetTaskListQuery) => {
    const { data } = await axiosInstance.get<GetListTaskResponse>('task/list', { params: query })

    return data.data
  },
  getListTaskByGroup: async (groupId: number) => {
    const { data } = await axiosInstance.get<GetListTaskResponse>(`task/list-by-group/${groupId}`)
    return data.data
  },
  create: async (payload: CreateTaskPayload) => {
    const { data } = await axiosInstance.post<GetTaskResponse>('task/create', payload)

    return data.data
  },
  update: async (payload: UpdateTaskPayload) => {
    const { data } = await axiosInstance.put<GetTaskResponse>('task/update', payload)
    return data.data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`task/delete/${id}`)
  },
  removeTaskFromGroup: async (payload: RemoveTaskFromGroupPayload) => {
    await axiosInstance.post('/task/remove-task-from-group', payload)
  },
  changeTimeTaskForGroup: async (payload: ChangeTimeTaskForGroupPayload) => {
    await axiosInstance.post('/task/change-time', payload)
  },
}
