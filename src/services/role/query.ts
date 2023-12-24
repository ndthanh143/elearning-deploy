import { roleService } from '.'
import { defineQuery } from '../../utils'

export const roleKeys = {
  all: ['role'] as const,
  lists: () => [...roleKeys.all, 'role'] as const,
  list: () => defineQuery([...roleKeys.lists()], () => roleService.getList()),
}
