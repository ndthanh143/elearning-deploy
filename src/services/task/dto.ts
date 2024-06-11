import { BasePaginationResponse, BaseResponse } from '../common/base.dto'

export type GetListTaskResponse = BasePaginationResponse<Task[]>
export type GetTaskResponse = BaseResponse<Task>

export type GetTaskListQuery = {}

export type UpdateTaskPayload = {
  id: number
  name: string
  size: number
}

export type CreateTaskPayload = {
  name: string
  description: string
}

export interface Task {
  id: number
  name: string
  description: number
}
