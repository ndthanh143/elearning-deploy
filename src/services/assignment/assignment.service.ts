import axiosInstance from '../../axios'
import { AssignmentResponse } from './assignment.dto'

export const assignmentService = {
  getDetail: async (assignmentId: number) => {
    const { data } = await axiosInstance.get<AssignmentResponse>(`/assignment/retrieve/${assignmentId}`)

    return data.data
  },
}
