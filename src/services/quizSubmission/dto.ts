import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '../common/base.dto'
import { Account } from '../user/user.dto'

export type QuizSubmissionReviewReponse = BaseResponse<QuizSubmissionReviewData>
export type QuizSubmissionsReviewReponse = BasePaginationResponse<QuizSubmission[]>

export type QuizSubmissionPayload = {
  courseId: number
  quizId: number
  results: resultPayload[]
  totalTime: number
  unitId: number
}

export type resultPayload = {
  answerId: number
}

export type QuizSubmission = {
  score: number
  totalTime: number
  studentInfo: Account
} & BaseData

export type QuizSubmissionReviewData = {
  questions: Question[]
  score: number
  totalTime: number
} & BaseData

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
  isCorrect: boolean
  isSelected: boolean
}

export type GetQuizSubmissionsQuery = {
  courseId?: number
  quizId?: number
} & PaginationQuery
