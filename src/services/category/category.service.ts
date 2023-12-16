import axiosInstance from '@/axios'
import { CategoriesResponse } from './category.dto'

export const categoryService = {
  getAllCategory: async () => {
    const { data } = await axiosInstance.get<CategoriesResponse>('/category/list')

    return data.data.content
  },
}
