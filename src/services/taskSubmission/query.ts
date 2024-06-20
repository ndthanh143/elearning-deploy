import { defineQuery } from '@/utils'
import { taskSubmissionService } from '.'

export const taskSubmissionKeys = {
  all: ['task-submission'] as const,
  lists: () => [...taskSubmissionKeys.all, 'list'] as const,
  list: (query: { groupTaskId: number }) =>
    defineQuery([...taskSubmissionKeys.lists(), query], () => taskSubmissionService.getListSubmission(query)),
}
