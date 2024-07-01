import { BaseData, BasePaginationResponse, PaginationQuery } from '../common/base.dto'
import { Course } from '../course/course.dto'
import { Account } from '../user/user.dto'

export type CoureseRegistrationResponse = BasePaginationResponse<CourseRegistration[]>

export type CourseRegistration = {
  status: number
  courseInfo: Course
  studentInfo: Account
} & BaseData

export type GetListStudentCourseQuery = {
  courseId?: number
  studentId?: number
} & PaginationQuery

export type EnrollPayload = {
  courseId: number
}
