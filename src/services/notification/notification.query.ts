import { defineQuery } from '@/utils'
import { notificationService } from './notification.service'
import { GetNotiQuery } from './notification.dto'

export const notificationKey = {
  all: ['notifications'] as const,
  lists: () => [...notificationKey.all, 'list'] as const,
  list: (query: GetNotiQuery) =>
    defineQuery([...notificationKey.lists(), query], () => notificationService.getList(query)),
}
