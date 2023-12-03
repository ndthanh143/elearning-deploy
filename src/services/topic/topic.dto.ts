import { BaseData, BasePaginationResponse, PaginationQuery } from '../common/base.dto'
import { TopicComment } from '../topicComment/topicComment.dto'
import { Account } from '../user/user.dto'

export type TopicsResponse = BasePaginationResponse<Topic[]>

export type GetTopicsQuery = {
  forumId: number
} & PaginationQuery

export type Topic = {
  topicTitle: string
  topicContent: string
  accountInfo: Account
  commentInfo: TopicComment[]
} & BaseData
