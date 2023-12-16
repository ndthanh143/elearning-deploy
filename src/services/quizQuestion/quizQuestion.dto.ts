import { BaseData, BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { Quiz } from '../quiz/quiz.dto'

export type QuizListResponse = BasePaginationResponse<QuizQuestion[]>
export type QuizQuestionResponse = BaseResponse<QuizQuestion>

export type QuizQuestion = {
  questionContent: string
  questionType: number
  quizInfo: Quiz
  score: number
  answers: Anwser[]
} & BaseData

export type GetQuizListQuery = {
  quizId: number
}

export type CreateQuestionPayload = {
  questionContent: string
  questionType: number
  quizId: number
  answers: AnwserCreate[]
}

export type AnwserCreate = {
  answerContent: string
  isCorrect: boolean
}

export type Anwser = {
  answerContent: string
  isCorrect: boolean
  id: number
}

export type UpdateQuestionPayload = {
  questionContent: string
  questionType: number
  id: number
  answers: Anwser[]
}
