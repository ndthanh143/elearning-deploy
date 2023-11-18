import { BaseData, BaseResponse } from '../common/base.dto'
import { Account } from '../user/user.dto'

export type CourseResponse = BaseResponse<Course>

export type Course = {
  courseName: string
  startDate: string
  state: number
  thumbnail: string
  teacherInfo: Account
} & BaseData
