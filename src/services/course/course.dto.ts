import Module from 'module'
import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '../common/base.dto'
import { Forum } from '../forum/forum.dto'
import { LessonPlan } from '../lessonPlan/lessonPlan.dto'
import { Account } from '../user/user.dto'

export type CourseResponse = BaseResponse<Course>
export type CoursesResponse = BasePaginationResponse<Course[]>

export type Course = {
  courseName: string
  startDate: string
  state: number
  description: string
  thumbnail: string
  teacherInfo: Account
  lessonPlanInfo?: LessonPlan
  objectives: string[]
  requirements: string[]
  forumInfo: Forum
  modulesInfo?: Module[]
} & BaseData

export type CreateCoursePayload = {
  name: string
  description: string
  objectives: string[]
  requirements: string[]
  thumbnail: string
}

export type GetListCoursesQuery = {
  teacherId?: number
} & PaginationQuery

export type UpdateCoursePayload = Partial<Course>
