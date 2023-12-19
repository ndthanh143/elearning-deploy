import { BaseData, BasePaginationResponse } from '../common/base.dto'
import { Module } from '../module/module.dto'

export type LessonPlansResponse = BasePaginationResponse<LessonPlan[]>

export type LessonPlan = {
  name: string
  description: string
  modulesInfo: Module[]
} & BaseData

export type GetLessonPlanQuery = {
  teacherId?: number
}

export type CreateLessonPlanPayload = {
  name: string
  description: string
  teacherId: number
}

export type UpdateLessonPlanPayload = {
  name: string
  description: string
  id: number
  status: number
}
