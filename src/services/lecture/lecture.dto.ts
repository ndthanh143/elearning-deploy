import { BaseData, BaseResponse } from '../common/base.dto'

export type LectureResponse = BaseResponse<Lecture>

export type Lecture = {
  lectureContent: string
  lectureName: string
} & BaseData

export type CreateLecturePayload = {
  modulesId: number
  lectureName: string
  lectureContent: string
}

export type UpdateLecturePayload = {
  id: number
  lectureName: string
  lectureContent: string
}
