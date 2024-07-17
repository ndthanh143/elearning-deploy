import axiosInstance from '@/axios'
import {
  ChangeLockAllPayload,
  ChangeLockPayload,
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
  enroll: async (groupId: number) => {
    await axiosInstance.post(`group/enroll`, { groupId })
  },
  leave: async (groupId: number) => {
    await axiosInstance.delete(`group/leave/${groupId}`)
  },
  addStudentToGroup: async (payload: { groupId: number; studentId: number }) => {
    await axiosInstance.post(`group/add-student-to-group`, payload)
  },
  removeStudentFromGroup: async ({ groupId, studentId }: { groupId: number; studentId: number }) => {
    await axiosInstance.delete(`group/remove-student/${groupId}/${studentId}`)
  },
  changeLock: async (payload: ChangeLockPayload) => {
    await axiosInstance.post('group/change-lock', payload)
  },
  changeLockAll: async (payload: ChangeLockAllPayload) => {
    await axiosInstance.post('group/change-lock-all', payload)
  },
}
