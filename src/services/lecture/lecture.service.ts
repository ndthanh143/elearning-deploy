import axiosInstance from '../../axios'
import { LectureResponse } from './lecture.dto'

export const lectureService = {
  getById: async (lectureId: number) => {
    const { data } = await axiosInstance.get<LectureResponse>(`/lecture/retrieve/${lectureId}`)

    return data.data
  },
}
