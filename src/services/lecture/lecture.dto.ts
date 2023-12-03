import { BaseData, BaseResponse } from '../common/base.dto'

export type LectureResponse = BaseResponse<Lecture>

export type Lecture = {
  lectureContent: string
  lectureName: string
} & BaseData
