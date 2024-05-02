import { defineQuery } from '@/utils'
import { GetListUnitQuery, SearchUnitQuery } from './types'
import { unitService } from '.'
export const unitKey = {
  all: ['unit'] as const,
  lists: () => [...unitKey.all, 'list'] as const,
  list: (query: GetListUnitQuery) => defineQuery([...unitKey.lists(), query], () => unitService.getList(query)),
  searches: () => [...unitKey.all, 'search'] as const,
  search: (query: SearchUnitQuery) => defineQuery([...unitKey.searches(), query], () => unitService.search(query)),
}
