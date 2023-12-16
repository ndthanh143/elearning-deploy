import { BasePaginationData, BaseResponse } from '../common/base.dto'

export interface Notification {
  id: number
  isRead: boolean
  message: string
  refId: number
  userId: number
}

export type NotificationsResponse = BaseResponse<BasePaginationData<Notification[]>>

export type GetNotiQuery = {
  userId?: number
}
