import axiosInstance from '@/axios'

export const studentService = {
  confirmInvitation: async (id: string) => {
    return axiosInstance.post('student/confirm-invitation', { id })
  },
}
