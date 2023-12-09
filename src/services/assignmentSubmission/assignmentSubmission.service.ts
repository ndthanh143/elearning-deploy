import axiosInstance from '../../axios'
import {
  CreateSubmissionPayload,
  GetSubmissionQuery,
  SubmissionsResponse,
  UpdateSubmissionPayload,
} from './assignmentSubmission.dto'

export const assignmentSubmissionService = {
  getList: async (query: GetSubmissionQuery = {}) => {
    const { data } = await axiosInstance.get<SubmissionsResponse>(`/assignment-submission/list`, {
      params: { ...query },
    })

    return data.data
  },

  create: async (payload: CreateSubmissionPayload) => {
    const { data } = await axiosInstance.post('/assignment-submission/submit', payload)

    return data
  },
  update: async (payload: UpdateSubmissionPayload) => {
    const { data } = await axiosInstance.put('/assignment-submission/update', payload)

    return data
  },
  delete: async (submissionId: number) => {
    await axiosInstance.delete(`/assignment-submission/delete/${submissionId}`)
  },
}
