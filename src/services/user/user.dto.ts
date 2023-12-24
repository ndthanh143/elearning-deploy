import { Assignment } from '../assignment/assignment.dto'
import { RoleEnum } from '../auth/auth.dto'
import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '../common/base.dto'
import { Course } from '../course/course.dto'
import { Quiz } from '../quiz/quiz.dto'

export type UserResponse = BaseResponse<Account>
export type ScheduleResponse = BaseResponse<ScheduleData>
export type RelativeMemberReponse = BasePaginationResponse<Account[]>
export type UsersResponse = BasePaginationResponse<Account[]>

export type GetStudentsQuery = {
  courseId: number
} & PaginationQuery

export type SearchStudentQuery = {
  email?: string
}

export type Account = {
  fullName: string
  avatarPath: string
  email: string
  isSuperAdmin: boolean
  kind: number
  roleInfo: Role
  nationInfo: any
} & BaseData

export type Role = {
  description: string
  kind: number
  name: RoleEnum
} & BaseData

export interface ScheduleData {
  assignmentsInfo: AssignmentsInfo[]
  quizzesInfo: QuizzesInfo[]
}

export interface AssignmentsInfo {
  assignmentInfo: Assignment
  courseInfo: Course
}

export interface QuizzesInfo {
  courseInfo: Course
  quizInfo: Quiz
}
