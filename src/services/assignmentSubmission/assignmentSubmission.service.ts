import axiosInstance from '../../axios'
import { AssignmentResponse } from './assignmentSubmission.dto'

export const assignmentSubmissionService = {
  getDetail: async (assignmentId: number) => {
    const { data } = await axiosInstance.get<AssignmentResponse>(`/assignment/retrieve/${assignmentId}`)

    return data.data
  },
}
