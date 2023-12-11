import { BaseData, BaseResponse } from '../common/base.dto'
import { Module } from '../module/module.dto'
import { QuizSubmission } from '../quizSubmission/dto'

export type QuizResponse = BaseResponse<Quiz>
export type QuizStartResponse = BaseResponse<QuizStartData>

export type GetQuizStartQuery = {
  courseId: number
  id: number
}

export type Quiz = {
  attemptNumber: number
  description: string
  quizTitle: string
  startDate: Date
  endDate: Date
  quizTimeLimit: number
  modulesInfo: Module
  quizSubmissionInfo: QuizSubmission[]
} & BaseData

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
