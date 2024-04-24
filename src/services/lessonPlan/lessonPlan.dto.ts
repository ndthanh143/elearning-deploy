import { BaseData, BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { Unit } from '../unit/types'

export type LessonPlansResponse = BasePaginationResponse<LessonPlan[]>
export type LessonPlanResponse = BaseResponse<LessonPlan>

export type LessonPlan = {
  name: string
  description: string
  type?: string
  units: Unit[]
} & BaseData

export type GetLessonPlanQuery = {
  teacherId?: number
}

export type CreateLessonPlanPayload = {
  name: string
  description: string
  teacherId: number
  type: string
}

export type UpdateLessonPlanPayload = {
  name: string
  description: string
  id: number
  status: number
}
