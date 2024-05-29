import { BaseData, BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { Unit } from '../unit/types'

export type LessonPlansResponse = BasePaginationResponse<LessonPlan[]>
export type LessonPlanResponse = BaseResponse<LessonPlan>

export type LessonPlan = {
  name: string
  type?: 'mindmap' | 'basic'
  units: Unit[]
} & BaseData

export type GetLessonPlanQuery = {
  teacherId?: number
}

export type CreateLessonPlanPayload = {
  name: string
  teacherId: number
  type: string
}

export type UpdateLessonPlanPayload = {
  name?: string
  id: number
  status?: number
}
