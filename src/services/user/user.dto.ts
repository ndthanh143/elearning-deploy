import { Assignment } from '../assignment/assignment.dto'
import { BaseData, BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { Course } from '../course/course.dto'
import { Quiz } from '../quiz/quiz.dto'

export type UserResponse = BaseResponse<Account>
export type ScheduleResponse = BaseResponse<ScheduleData>
export type RelativeMemberReponse = BasePaginationResponse<Account[]>

export type Account = {
  fullName: string
  avatarPath: string
  email: string
  isSuperAdmin: boolean
  kind: number
  roleInfo: Role
} & BaseData

export type Role = {
  description: string
  kind: number
  name: string
}

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
