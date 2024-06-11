import axiosInstance from '@/axios'
import {
  CreateGroupPayload,
  GenerateGroupPayload,
  GetGroupListQuery,
  GetGroupResponse,
  GetListGroupResponse,
  UpdateGroupPayload,
} from './dto'

export const groupService = {
  getListGroup: async (query: GetGroupListQuery) => {
    const { data } = await axiosInstance.get<GetListGroupResponse>('group/list', { params: query })

    return data.data
  },
  create: async (payload: CreateGroupPayload) => {
    const { data } = await axiosInstance.post<GetGroupResponse>('group/create', payload)

    return data.data
  },
  autoGenerate: async (payload: GenerateGroupPayload) => {
    return axiosInstance.post('group/auto-generate', payload)
  },
  update: async (payload: UpdateGroupPayload) => {
    const { data } = await axiosInstance.put<GetGroupResponse>('group/update', payload)
    return data.data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`group/delete/${id}`)
  },
}
