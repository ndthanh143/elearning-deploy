import { defineQuery } from '@/utils'
import { quizService } from './quiz.service'
import { GetListQuizQuery, GetQuizDetailParams, GetQuizScheduleQuery, GetQuizStartQuery } from './quiz.dto'

export const quizKey = {
  all: ['quiz'] as const,
  lists: () => [...quizKey.all, 'list'] as const,
  list: (query: GetListQuizQuery) => defineQuery([...quizKey.lists(), query], () => quizService.getList(query)),
  details: () => [...quizKey.all, 'detail'] as const,
  detail: (params: GetQuizDetailParams) =>
    defineQuery([...quizKey.details(), params], () => quizService.getDetail(params)),
  starts: () => [...quizKey.all, 'start'] as const,
  start: (query: GetQuizStartQuery) => defineQuery([...quizKey.starts(), query], () => quizService.getInStart(query)),
  schedules: () => [...quizKey.all, 'quiz-schedule'] as const,
  schedule: (query: GetQuizScheduleQuery) =>
    defineQuery([...quizKey.schedules(), query], () => quizService.getSchedule(query)),
}
