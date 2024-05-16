import { defineQuery } from '../../utils'
import { GetForumsQuery } from './forum.dto'
import { forumService } from './forum.service'

export const forumKeys = {
  all: ['forum'] as const,
  lists: () => [...forumKeys.all, 'list'] as const,
  list: (query?: GetForumsQuery) => defineQuery([...forumKeys.lists(), query], () => forumService.getForums(query)),
  details: () => [...forumKeys.all, 'detail'] as const,
  detail: (id: number) => defineQuery([...forumKeys.details(), id], () => forumService.getForum(id)),
}
