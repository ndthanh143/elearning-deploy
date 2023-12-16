import { BaseResponse } from '../common/base.dto'
import { AnwserCreate, QuizQuestion } from '../quizQuestion/quizQuestion.dto'

export type AnwsersResponse = BaseResponse<AnswerCreateProps[]>

export type CreateAnswerPayload = {
  answers: AnwserCreate[]
  questionId: number
}
export type AnswerCreateProps = {
  id: number
  answerContent: string
  isCorrect: boolean
  questionInfo: QuizQuestion
}
