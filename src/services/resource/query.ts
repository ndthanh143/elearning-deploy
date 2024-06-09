import { defineQuery } from '../../utils'
import { resourceService } from './resource.service'

export const resourceKey = {
  all: ['resource'] as const,
  details: () => [...resourceKey.all, 'detail'] as const,
  detail: (id: number) => defineQuery([...resourceKey.details(), id], () => resourceService.getResourceDetails(id)),
}
