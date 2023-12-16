import { defineQuery } from '@/utils'
import { GetModulesQuery } from './module.dto'
import { moduleService } from './module.service'
export const moduleKey = {
  all: ['module'] as const,
  lists: () => [...moduleKey.all, 'list'] as const,
  list: (query: GetModulesQuery) => defineQuery([...moduleKey.lists(), query], () => moduleService.getList(query)),
}
