import axiosInstance from '../../axios'
import { CreateModulePayload, GetModulesQuery, GetModulesResponse } from './module.dto'

export const moduleService = {
  getList: async (query: GetModulesQuery) => {
    const { data } = await axiosInstance.get<GetModulesResponse>('/modules/list', {
      params: {
        ...query,
      },
    })

    return data.data
  },
  create: async (payload: CreateModulePayload) => {
    const { data } = await axiosInstance.post('modules/create', payload)

    return data
  },
}
