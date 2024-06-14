import { taskService } from '.'
import { defineQuery } from '../../utils'
import { GetTaskListQuery } from './dto'

export const taskKeys = {
  all: ['task'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (query: GetTaskListQuery = {}) =>
    defineQuery([...taskKeys.lists(), query], () => taskService.getListTask(query)),
  listByGroups: () => [...taskKeys.all, 'list-by-group'] as const,
  listByGroup: (groupId: number) =>
    defineQuery([...taskKeys.lists(), groupId], () => taskService.getListTaskByGroup(groupId)),
}
