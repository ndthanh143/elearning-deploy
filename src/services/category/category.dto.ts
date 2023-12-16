import { BaseData, BasePaginationResponse } from '../common/base.dto'

export type CategoriesResponse = BasePaginationResponse<Category[]>

export type Category = {
  createDate: string
  name: string
  status: number
} & BaseData
