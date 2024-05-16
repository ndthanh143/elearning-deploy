import { Topic } from '../topic/topic.dto'
import { Course } from '../course/course.dto'
import { BaseData, BasePaginationResponse, BaseResponse } from '../common/base.dto'

export type ForumsResponse = BasePaginationResponse<Forum[]>
export type ForumResponse = BaseResponse<Forum>

export type Forum = {
  courseInfo: Course
  forumTitle: string
  description: string
  topicInfo?: Topic[]
} & BaseData

export type GetForumsQuery = {
  courseId?: number
  accountId?: number
  title?: string
}
