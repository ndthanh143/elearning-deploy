import { defineQuery } from '@/utils'
import { GetLessonPlanQuery } from './lessonPlan.dto'
import { lessonPlanService } from './lessonPlan.service'

export const lessonPlanKey = {
  all: ['lesson-plan'] as const,
  lists: () => [...lessonPlanKey.all, 'list'] as const,
  list: (query: GetLessonPlanQuery) =>
    defineQuery([...lessonPlanKey.lists(), query], () => lessonPlanService.getList(query)),
  details: () => [...lessonPlanKey.all, 'detail'] as const,
  detail: (lessonPlanId: number) =>
    defineQuery([...lessonPlanKey.details(), lessonPlanId], () => lessonPlanService.getDetail(lessonPlanId)),
}
