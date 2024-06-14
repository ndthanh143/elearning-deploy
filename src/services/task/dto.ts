import { BasePaginationResponse, BaseResponse } from '../common/base.dto'

export type GetListTaskResponse = BasePaginationResponse<Task[]>
export type GetTaskResponse = BaseResponse<Task>

export type GetTaskListQuery = {}

export type UpdateTaskPayload = {
  id: number
  name: string
  description: string
}

export type CreateTaskPayload = {
  name: string
  description: string
}

export interface Task {
  id: number
  name: string
  description: string
}

export type RemoveTaskFromGroupPayload = {
  groupId: number
  taskId: number
}

export type ChangeTimeTaskForGroupPayload = {
  groupId: number
  taskId: number
  startDate: string
  endDate: string
}
