import { BaseData } from '../common/base.dto'
import { Module } from '../module/module.dto'

export type LessonPlan = {
  name: string
  description: string
  modulesInfo: Module[]
} & BaseData
