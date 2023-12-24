import { nationService } from '.'
import { defineQuery } from '../../utils'

export const nationKeys = {
  all: ['nation'] as const,
  lists: () => [...nationKeys.all, 'nation'] as const,
  list: () => defineQuery([...nationKeys.lists()], () => nationService.getList()),
}
