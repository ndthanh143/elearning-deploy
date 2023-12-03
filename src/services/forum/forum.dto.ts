import { BaseData, BasePaginationResponse } from '../common/base.dto'
import { Course } from '../course/course.dto'
import { Topic } from '../topic/topic.dto'

export type ForumsResponse = BasePaginationResponse<Forum[]>

export type Forum = {
  courseInfo: Course
  forumTitle: string
  description: string
  topicInfo?: Topic[]
} & BaseData

export type GetForumsQuery = {
  courseId?: number
  accountId?: number
}
