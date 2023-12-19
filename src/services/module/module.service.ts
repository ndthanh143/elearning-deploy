import axiosInstance from '../../axios'
import { CreateModulePayload, GetModulesQuery, GetModulesResponse, UpdateModulePayload } from './module.dto'

export const moduleService = {
  getList: async (query: GetModulesQuery) => {
    const { data } = await axiosInstance.get<GetModulesResponse>('/modules/list', {
      params: {
        ...query,
      },
    })

    return data.data
  },
  update: async (payload: UpdateModulePayload) => {
    const { data } = await axiosInstance.put('modules/update', payload)

    return data
  },
  create: async (payload: CreateModulePayload) => {
    const { data } = await axiosInstance.post('modules/create', payload)

    return data
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`modules/delete/${id}`)
  },
}
