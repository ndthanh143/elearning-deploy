import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '../common/base.dto'
import { TopicComment } from '../topicComment/topicComment.dto'
import { Account } from '../user/user.dto'

export type TopicsResponse = BasePaginationResponse<Topic[]>
export type TopicResponse = BaseResponse<Topic>

export type GetTopicsQuery = {
  forumId: number
} & PaginationQuery

export type Topic = {
  topicContent: string
  accountInfo: Account
  commentInfo: TopicComment[]
} & BaseData

export type CreateTopicPayload = {
  accountId: number
  forumId: number
  topicContent: string
}
