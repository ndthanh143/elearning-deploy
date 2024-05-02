import axiosInstance from '@/axios'
import {
  CreateUnitPayload,
  GetDetailUnitResponse,
  GetListUnitQuery,
  GetListUnitResponse,
  SearchUnitQuery,
  UpdateUnitPayload,
} from './types'

export const unitService = {
  search: async (query: SearchUnitQuery) => {
    const { data } = await axiosInstance.get<GetListUnitResponse>('unit/auto-complete', { params: query })

    return data.data
  },
  create: async (payload: CreateUnitPayload) => {
    const { data } = await axiosInstance.post<GetDetailUnitResponse>('unit/create', payload)

    return data.data
  },
  getDetail: async (unitId: number) => {
    const { data } = await axiosInstance.get<GetDetailUnitResponse>(`unit/retrieve/${unitId}`)

    return data.data
  },
  getList: async (query: GetListUnitQuery) => {
    const { data } = await axiosInstance.get<GetListUnitResponse>('unit/list', { params: query })

    return data.data
  },
  update: async (payload: UpdateUnitPayload) => {
    const { data } = await axiosInstance.put<GetDetailUnitResponse>('unit/update', payload)

    return data.data
  },
  delete: async (id: number) => {
    return axiosInstance.delete(`unit/delete/${id}`)
  },
}
