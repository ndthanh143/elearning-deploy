import { BaseData, BaseResponse } from '../common/base.dto'
import { Account } from '../user/user.dto'

export type TopicCommentResponse = BaseResponse<TopicComment>

export type TopicComment = {
  accountInfo: Account
  content: string
} & BaseData

export type CreateTopicCommentPayload = {
  accountId: number
  content: string
  topicId: number
}

export type UpdateTopicCommentPayload = {
  content: string
  id: number
}
