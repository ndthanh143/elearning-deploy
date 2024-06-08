import { BaseData, BasePaginationResponse, BaseResponse } from '../common/base.dto'
import { GroupComment } from '../groupComment/types'
import { Account } from '../user/user.dto'

export type GetCommentsResponse = BasePaginationResponse<Comment[]>
export type GetCommentResponse = BaseResponse<Comment>

export type CreateCommentPayload = {
  assignmentId?: number
  blockId?: string
  content: string
  courseId: number
  groupCommentId?: number
  lectureId?: number
  unitId: number
}

export type Comment = {
  content: string
  teacherInfo?: Account
  studentInfo?: Account
  groupCommentInfo: GroupComment
} & BaseData

export type GetCommentsQuery = {
  unpaged?: boolean
  courseId?: number
  unitId?: number
  lectureId?: number
  assignmentId?: number
  groupCommentId?: number
}
