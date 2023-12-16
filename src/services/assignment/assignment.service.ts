import axiosInstance from '../../axios'
import { AssignmentResponse, CreateAssignmentPayload, UpdateAssignmentPayload } from './assignment.dto'

export const assignmentService = {
  getDetail: async (assignmentId: number) => {
    const { data } = await axiosInstance.get<AssignmentResponse>(`/assignment/retrieve/${assignmentId}`)

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
