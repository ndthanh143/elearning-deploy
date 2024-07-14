import { BaseData, BaseResponse } from '../common/base.dto'

export type LectureResponse = BaseResponse<Lecture>

export type Lecture = {
  lectureContent: string
  lectureName: string
} & BaseData

export type CreateLecturePayload = {
  lectureName: string
  lectureContent: string
}

export type CreateLectureWithUnitPayload = {
  lessonPlanId: number
  parentId?: number
  position?: {
    x: number
    y: number
  }
} & CreateLecturePayload

export type UpdateLecturePayload = {
  id: number
  lectureName?: string
  lectureContent?: string
}

export type CreateLectureTrackingPayload = {
  courseId: number
  lectureId: number
  unitId: number
}

export type GetLectureDetailParams = {
  courseId?: number
  lectureId: number
  unitId?: number
}
