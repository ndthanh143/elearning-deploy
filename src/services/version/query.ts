import { defineQuery } from '@/utils'
import { versionService } from '.'
export const versionKey = {
  all: ['unit'] as const,
  lists: () => [...versionKey.all, 'list'] as const,
  list: (query: any) => defineQuery([...versionKey.lists(), query], () => versionService.getList(query)),
}
