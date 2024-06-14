import { groupTaskService } from '.'
import { defineQuery } from '../../utils'
import { GetGroupTaskListQuery } from './dto'

export const groupTaskKeys = {
  all: ['group-task'] as const,
  lists: () => [...groupTaskKeys.all, 'list'] as const,
  list: (query: GetGroupTaskListQuery = {}) =>
    defineQuery([...groupTaskKeys.lists(), query], () => groupTaskService.getListTask(query)),
}
