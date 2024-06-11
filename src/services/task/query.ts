import { taskService } from '.'
import { defineQuery } from '../../utils'
import { GetTaskListQuery } from './dto'

export const taskKeys = {
  all: ['task'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (query: GetTaskListQuery = {}) =>
    defineQuery([...taskKeys.lists(), query], () => taskService.getListTask(query)),
}
