import { BaseData, BasePaginationResponse } from '../common/base.dto'

export type CategoriesResponse = BasePaginationResponse<Category[]>
export type CategoriesSearchResponse = BasePaginationResponse<CategorySearch[]>

export type Category = {
  createDate: string
  name: string
  status: number
} & BaseData

export type CategorySearch = {
  categoryName: string
} & BaseData
