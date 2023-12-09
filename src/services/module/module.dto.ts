import { Assignment } from '../assignment/assignment.dto'
import { BaseData, BasePaginationResponse } from '../common/base.dto'
import { Lecture } from '../lecture/lecture.dto'
import { Quiz } from '../quiz/quiz.dto'
import { Resource } from '../resource/resource.dto'

export type GetModulesResponse = BasePaginationResponse<Module>

export type GetModulesQuery = {
  lessonPlanId?: number
}

export type Module = {
  modulesName: string
  description: string
  lectureInfo: Lecture[]
  assignmentInfo: Assignment[]
  resourceInfo: Resource[]
  quizInfo: Quiz[]
} & BaseData
