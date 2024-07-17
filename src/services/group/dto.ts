import { BasePaginationResponse, BaseResponse } from '../common/base.dto'

export type GetListGroupResponse = BasePaginationResponse<Group[]>
export type GetGroupResponse = BaseResponse<Group>

export type GetGroupListQuery = {
  courseId?: number
}

export type UpdateGroupPayload = {
  id: number
  name: string
  size: number
}

export type CreateGroupPayload = {
  courseId: number
  name: string
  size: number
}

export type GenerateGroupPayload = {
  courseId: number
  maxMember: number
  minMember: number
}

export interface Group {
  courseInfo: CourseInfo
  id: number
  name: string
  size: number
  studentInfo: Info[]
  groupTaskInfo: GroupTaskInfo[]
  isLocked: boolean
}

export interface CourseInfo {
  categoryInfo: CategoryInfo
  congratulation: string
  courseName: string
  currency: string
  description: string
  id: number
  isPublic: boolean
  lessonPlanInfo: LessonPlanInfo
  price: number
  startDate: Date
  state: number
  teacherInfo: Info
  thumbnail: string
  welcome: string
}

export interface CategoryInfo {
  categoryName: string
  id: number
}

export interface LessonPlanInfo {
  description: string
  id: number
  name: string
  teacherInfo: Info
  type: string
}

export interface Info {
  avatarPath: string
  email: string
  fullName: string
  id: number
}

export interface GroupTaskInfo {
  description: string
  endDate: string
  groupId: number
  groupName: string
  id: number
  taskName: string
  startDate: string
  isSubmitted?: boolean
  taskId?: number
  score?: number
}

export interface ChangeLockPayload {
  groupId: number
  isLocked: boolean
}

export interface ChangeLockAllPayload {
  courseId: number
  isLocked: boolean
}
