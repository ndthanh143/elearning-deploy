import { defineQuery } from '../../utils'
import { categoryService } from './category.service'

export const categoryKeys = {
  all: ['course'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => defineQuery([...categoryKeys.lists()], () => categoryService.getAllCategory()),
  autoCompletes: () => [...categoryKeys.all, 'auto-complete'] as const,
  autoComplete: () => defineQuery([...categoryKeys.autoCompletes()], () => categoryService.autoComplete()),
}
