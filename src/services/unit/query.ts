import { defineQuery } from '@/utils'
import { GetListUnitQuery } from './types'
import { unitService } from '.'
export const unitKey = {
  all: ['unit'] as const,
  lists: () => [...unitKey.all, 'list'] as const,
  list: (query: GetListUnitQuery) => defineQuery([...unitKey.lists(), query], () => unitService.getList(query)),
}
