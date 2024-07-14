import axiosInstance from '@/axios'

import {
  CreateResourcePayload,
  CreateResourceUnitPayload,
  CreateTrackingResourcePayload,
  GetResourceDetailParams,
  GetResourceResponse,
  UpdateResourcePayload,
} from './resource.dto'
import { unitService } from '../unit'

export const resourceService = {
  getResourceDetails: async (params: GetResourceDetailParams) => {
    const { resourceId, ...query } = params
    const { data } = await axiosInstance.get<GetResourceResponse>(`/resources/retrieve/${resourceId}`, {
      params: query,
    })

    return data.data
  },
  create: async (payload: CreateResourcePayload) => {
    const { data } = await axiosInstance.post<GetResourceResponse>('/resources/create', {
      contentType: 'video/quicktime',
      ...payload,
    })

    return data.data
  },
  createWithUnit: async (payload: CreateResourceUnitPayload) => {
    const { lessonPlanId, parentId, position, ...props } = payload

    const { data } = await axiosInstance.post<GetResourceResponse>('/resources/create', {
      contentType: 'video/quicktime',
      ...props,
    })

    await unitService.create({
      lessonPlanId,
      parentId,
      position,
      resourceId: data.data.id,
      name: data.data.title,
    })

    return data.data
  },
  update: async (payload: UpdateResourcePayload) => {
    const { data } = await axiosInstance.put('/resources/update', payload)

    return data
  },
  delete: async (resourceId: number) => {
    await axiosInstance.delete(`/resources/delete/${resourceId}`)
  },
  createTracking: async (payload: CreateTrackingResourcePayload) => {
    await axiosInstance.post('/resource-tracking/create', payload)
  },
}
