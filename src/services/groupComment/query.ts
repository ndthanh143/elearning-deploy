import { groupCommentService } from '.'
import { defineQuery } from '../../utils'
import { GetGroupCommentsQuery } from './types'

export const groupCommentKeys = {
  all: ['group-comment'] as const,
  lists: () => [...groupCommentKeys.all, 'list'] as const,
  list: (query: GetGroupCommentsQuery) =>
    defineQuery([...groupCommentKeys.lists(), query], () => groupCommentService.getList(query)),
}
