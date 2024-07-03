import { Assignment } from '../assignment/assignment.dto'
import { BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { Lecture } from '../lecture/lecture.dto'
import { LessonPlan } from '../lessonPlan/lessonPlan.dto'
import { Quiz } from '../quiz/quiz.dto'
import { Resource } from '../resource/resource.dto'

export type GetDetailUnitResponse = BaseResponse<Unit>
export type GetListUnitResponse = BasePaginationResponse<Unit[]>

export type CreateUnitPayload = {
  description: string
  lessonPlanId: number
  name: string
  parentId?: number
  position?: Position
  lectureId?: number
  quizId?: number
  resourceId?: number
  assignmentId?: number
}

export interface Position {
  x: number
  y: number
}

export type Unit = {
  assignmentInfo: Assignment
  description: string
  id: number
  lectureInfo?: Lecture
  lessonPlanInfo?: LessonPlan
  name: string
  parent?: Unit
  position?: Position
  prerequisites: Unit[]
  quizInfo?: Quiz
  resourceInfo?: Resource
  unlock: boolean
  isDone: boolean
  labelConnection?: string
}

export type GetListUnitQuery = {
  lessonPlanId: number
  unpaged?: boolean
}

export type UpdateUnitPayload = {
  assignmentId?: number
  description?: string
  id: number
  lectureId?: number
  name?: string
  position?: Position
  prerequisites?: PrerequisiteUpdate[]
  quizId?: number
  resourceId?: number
  parentId?: number
}

export interface PrerequisiteUpdate {
  prerequisiteId: number
}

export type SearchUnitQuery = {
  q?: string
  page?: number
  size?: number
  lessonPlanId?: number
}

export type UnitType = 'assignment' | 'lecture' | 'resource' | 'quiz' | 'video'

export type TrackingUnitPayload = {
  courseId: number
  unitId: number
}
