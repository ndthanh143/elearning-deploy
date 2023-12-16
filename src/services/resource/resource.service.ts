import axiosInstance from '@/axios'

import { CreateResourcePayload, UpdateResourcePayload } from './resource.dto'

export const resourceService = {
  create: async (payload: CreateResourcePayload) => {
    const { data } = await axiosInstance.post('/resources/create', payload)

    return data
  },
  update: async (payload: UpdateResourcePayload) => {
    const { data } = await axiosInstance.put('/resources/update', payload)

    return data
  },
  delete: async (resourceId: number) => {
    await axiosInstance.delete(`/resources/delete/${resourceId}`)
  },
}
