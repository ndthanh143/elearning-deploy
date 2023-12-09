import { BaseData, BasePaginationResponse } from '../common/base.dto'
import { Quiz } from '../quiz/quiz.dto'

export type QuizListResponse = BasePaginationResponse<QuizQuestion[]>

export type QuizQuestion = {
  questionContent: string
  questionType: number
  quizInfo: Quiz
  score: number
} & BaseData

export type GetQuizListQuery = {
  quizId: number
}
