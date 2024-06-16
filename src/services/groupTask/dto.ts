import { BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { Group } from '../group/dto'
import { Task } from '../task/dto'

export type GetListGroupTaskResponse = BasePaginationResponse<GroupTask[]>
export type GetGroupTaskResponse = BaseResponse<GroupTask>

export type GetGroupTaskListQuery = {
  groupId?: number
}

export type UpdateGroupTaskPayload = {
  id: number
  endDate: string
  startDate: string
}
export type CreateGroupTaskPayload = {
  endDate: string
  groupId: number
  startDate: string
  taskId: number
}

export interface GroupTask {
  id: number
  startDate: string
  endDate: string
  taskInfo: Task
  groupInfo: Group
}
