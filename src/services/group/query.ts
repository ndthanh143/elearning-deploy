import { groupService } from '.'
import { defineQuery } from '../../utils'
import { GetGroupListQuery } from './dto'

export const groupKeys = {
  all: ['group'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (query: GetGroupListQuery) =>
    defineQuery([...groupKeys.lists(), query], () => groupService.getListGroup(query)),
}
