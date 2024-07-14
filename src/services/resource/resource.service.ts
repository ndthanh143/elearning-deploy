import axiosInstance from '@/axios'

import {
  CreateResourcePayload,
  CreateTrackingResourcePayload,
  GetResourceDetailParams,
  GetResourceResponse,
  UpdateResourcePayload,
} from './resource.dto'

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
