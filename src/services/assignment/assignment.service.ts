import axiosInstance from '../../axios'
import {
  AssignmentResponse,
  AssignmentsResponse,
  CreateAssignmentPayload,
  GetAssignmentDetailParams,
  GetListAssignmentQuery,
  GetScheduleAssignmentResponse,
  GetScheduleQuery,
  UpdateAssignmentPayload,
} from './assignment.dto'

export const assignmentService = {
  getList: async (query: GetListAssignmentQuery) => {
    const { data } = await axiosInstance.get<AssignmentsResponse>('/assignment/list', { params: { ...query } })
    return data.data
  },
  getDetail: async (params: GetAssignmentDetailParams) => {
    const { assignmentId, ...query } = params
    const { data } = await axiosInstance.get<AssignmentResponse>(`/assignment/retrieve/${assignmentId}`, {
      params: {
        ...query,
      },
    })

    return data.data
  },
  getSchedule: async (query: GetScheduleQuery) => {
    const { data } = await axiosInstance.get<GetScheduleAssignmentResponse>('/assignment/schedule', {
      params: { ...query },
    })

    return data.data
  },
  create: async (payload: CreateAssignmentPayload) => {
    const { data } = await axiosInstance.post<AssignmentResponse>('/assignment/create', payload)

    return data.data
  },
  update: async (payload: UpdateAssignmentPayload) => {
    const { data } = await axiosInstance.put<AssignmentResponse>('/assignment/update', payload)

    return data.data
  },
  delete: async (assignmentId: number) => {
    await axiosInstance.delete(`/assignment/delete/${assignmentId}`)
  },
}
