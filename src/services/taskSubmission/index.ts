import axiosInstance from '@/axios'

export const taskSubmissionService = {
  submit: async (payload: { fileUrl: string; groupTaskId: number }) => {
    return axiosInstance.post('task-submission/submit', payload)
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`task-submission/delete/${id}`)
  },
}
