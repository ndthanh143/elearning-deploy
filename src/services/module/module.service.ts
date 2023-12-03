import axiosInstance from '../../axios'
import { GetModulesQuery } from './module.dto'

export const moduleService = {
  getList: async (query: GetModulesQuery) => {
    const { data } = await axiosInstance.get('/module/list', {
      params: {
        ...query,
      },
    })

    return data
  },
}
