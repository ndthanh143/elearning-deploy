export type BaseResponse<T> = {
  result: boolean
  data: T
}

export type BasePaginationResponse<T> = {
  result: boolean
  data: BasePaginationData<T>
}

export type BaseData = {
  id: number
  createDate: Date
  modifiedDate: Date
}

export type PaginationQuery = {
  page?: number
  size?: number
  paged?: boolean
}

export type BasePaginationData<T> = {
  content: T
  pageIndex: number
  pageSize: number
  totalElements: number
  totalPages: number
}
