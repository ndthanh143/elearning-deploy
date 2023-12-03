import { defineQuery } from '@/utils'
import { GetTopicsQuery } from './topic.dto'
import { topicService } from './topic.service'

export const topicKeys = {
  all: ['topic'] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  list: (query?: GetTopicsQuery) => defineQuery([...topicKeys.lists(), query], () => topicService.getAll(query)),
}
