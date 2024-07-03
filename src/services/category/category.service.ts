import axiosInstance from '@/axios'
import { CategoriesResponse, CategoriesSearchResponse } from './category.dto'

export const categoryService = {
  autoComplete: async () => {
    const { data } = await axiosInstance.get<CategoriesSearchResponse>('/category/auto-complete')
    return data.data
  },
  getAllCategory: async () => {
    const { data } = await axiosInstance.get<CategoriesResponse>('/category/list')

    return data.data.content
  },
}
