import axiosInstance from '@/axios'

export const teacherService = {
  inviteStudentsToCourse: async ({ courseId, emails }: { courseId: number; emails: string[] }) => {
    await axiosInstance.post(`/teacher/invite-students-to-course`, { emails, courseId })

    return emails
  },
}
