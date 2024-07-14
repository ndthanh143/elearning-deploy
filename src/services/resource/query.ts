import { defineQuery } from '../../utils'
import { GetResourceDetailParams } from './resource.dto'
import { resourceService } from './resource.service'

export const resourceKey = {
  all: ['resource'] as const,
  details: () => [...resourceKey.all, 'detail'] as const,
  detail: (params: GetResourceDetailParams) =>
    defineQuery([...resourceKey.details(), params], () => resourceService.getResourceDetails(params)),
}
