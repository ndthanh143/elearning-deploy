import { BaseData, BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { QuizSubmission } from '../quizSubmission/dto'
import { Unit } from '../unit/types'

export type QuizResponse = BaseResponse<Quiz>
export type QuizStartResponse = BaseResponse<QuizStartData>
export type QuizzesResponse = BasePaginationResponse<Quiz[]>
export type GetQuizScheduleResponse = BaseResponse<QuizSchedule[]>

export type GetQuizStartQuery = {
  courseId: number
  id: number
  unitId: number
}

export type Quiz = {
  attemptNumber: number
  description: string
  quizTitle: string
  startDate?: string
  endDate?: string
  quizTimeLimit: number
  unitInfo: Unit
  quizSubmissionInfo: QuizSubmission[]
  isPublicAnswer: boolean
} & BaseData

export type UpdateQuizPayload = {
  id: number
  attemptNumber: number
  description?: string
  quizTitle: string
  startDate?: string
  endDate?: string
  quizTimeLimit: number
  isPublicAnswer: boolean
}

export type QuizStartData = {
  attemptNumber: number
  description: string
  endDate: Date
  id: number
  questions: Question[]
  quizTimeLimit: number
  quizTitle: string
  startDate: Date
}

export interface Question {
  answers: Answer[]
  id: number
  questionContent: string
  questionType: number
  score: number
}

export interface Answer {
  answerContent: string
  id: number
}

export type CreateQuizPayload = {
  attemptNumber: number
  description?: string
  endDate?: string
  quizTimeLimit: number
  quizTitle: string
  startDate?: string
  isPublicAnswer: boolean
}

export type CreateQuizWithUnitPayload = {
  lessonPlanId: number
  parentId?: number
  position?: {
    x: number
    y: number
  }
} & CreateQuizPayload

export type GetListQuizQuery = {
  courseId?: number
}

export type GetQuizScheduleQuery = {
  startDate: string
  endDate: string
}

export type QuizSchedule = {
  attemptNumber: string
  courseId: number
  courseName: string
  endDate: number
  id: number
  quizTimeLimit: number
  quizTitle: string
  startDate: number
  unitId: number
  unitName: string
}

export type GetQuizDetailParams = {
  courseId?: number
  quizId: number
  unitId?: number
}
