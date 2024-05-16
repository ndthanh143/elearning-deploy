import { commentService } from '.'
import { defineQuery } from '../../utils'
import { GetCommentsQuery } from './types'

export const commentKeys = {
  all: ['comment'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (query: GetCommentsQuery) => defineQuery([...commentKeys.lists(), query], () => commentService.getList(query)),
}
