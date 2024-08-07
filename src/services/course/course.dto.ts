import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '../common/base.dto'
import { Forum } from '../forum/forum.dto'
import { LessonPlan } from '../lessonPlan/lessonPlan.dto'
import { Account } from '../user/user.dto'
import { Unit } from '../unit/types'

export type CourseResponse = BaseResponse<Course>
export type CoursesResponse = BasePaginationResponse<Course[]>

export type Course = {
  courseName: string
  startDate: string
  state: number
  description: string
  thumbnail: string
  teacherInfo: Account
  lessonPlanInfo: LessonPlan
  objectives: string[]
  requirements: string[]
  totalUnitDone?: number
  totalUnit?: number
  amountOfStudent?: number
  forumInfo?: Forum
  unit?: Unit[]
  currency?: string
  price?: number
  welcome?: string
  congratulation?: string
  isFirstJoin?: boolean
  isPublic?: boolean
  categoryInfo?: { id: number; name: string; categoryName: string }
  versionInfo?: Version
} & BaseData

export type Version = {
  createDate: string
  id: number
  modifiedDate: string
  note: string
  state: number
  versionCode: number
  courseInfo: Course
}

export const VERSION_STATE = {
  init: 1,
  pending: 2,
  approved: 3,
  rejected: 4,
} as const

export type CreateCoursePayload = {
  courseName: string
  description: string
  objectives: string[]
  requirements: string[]
  thumbnail: string
  startDate?: string
  currency?: string
  price?: number
  categoryId: number
  welcome?: string
  state?: number
  lessonPlanId?: number
  congratulation?: string
  isPublic?: boolean
}

export type GetListCoursesQuery = {
  teacherId?: number
} & PaginationQuery

export type UpdateCoursePayload = {
  categoryId?: number
  courseName?: string
  description?: string
  id: number
  lessonPlanId?: number
  objectives?: string[]
  requirements?: string[]
  startDate?: string
  state: number
  teacherId?: number
  thumbnail?: string
  isPublic?: boolean
}

export type AutoCompleteCourseQuery = {
  q?: string
  categoryIds?: string
} & PaginationQuery

export type GetMyCoursesQuery = {} & PaginationQuery
