import { BaseData, BaseResponse } from '../common/base.dto'

export type QuizSubmissionReviewReponse = BaseResponse<QuizSubmissionReviewData>

export type QuizSubmissionPayload = {
  courseId: number
  quizId: number
  results: resultPayload[]
  totalTime: number
}

export type resultPayload = {
  answerId: number
}

export type QuizSubmission = {
  score: number
  totalTime: number
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
