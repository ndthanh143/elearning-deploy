import { number } from 'yup'
import { BaseData, BaseResponse } from '../common/base.dto'
import { Course } from '../course/course.dto'
import { Account } from '../user/user.dto'

export type CoureseRegistrationResponse = BaseResponse<CoursesRegistrationData>

export type CoursesRegistrationData = {
  content: CourseRegistration[]
  totalElements: number
  totalPages: number
}

export type CourseRegistration = {
  status: number
  courseInfo: Course
  studentInfo: Account
} & BaseData

export type getListStudentCourseQuery = {
  studentId: number
}
