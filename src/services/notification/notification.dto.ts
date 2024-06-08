import { BasePaginationData, BaseResponse } from '../common/base.dto'
import { Account } from '../user/user.dto'

export interface Notification {
  id: number
  isRead: boolean
  message: string
  refId: number
  userId: number
  studentInfo?: Account
  teacherInfo?: Account
  kind: 'TOPIC' | 'COMMENT'
}

export type NotificationsResponse = BaseResponse<BasePaginationData<Notification[]>>

export type GetNotiQuery = {
  userId?: number
}
