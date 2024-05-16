import { Assignment } from '../assignment/assignment.dto'
import { Comment } from '../comment/types'
import { BaseData, BasePaginationResponse } from '../common/base.dto'
import { Course } from '../course/course.dto'
import { Lecture } from '../lecture/lecture.dto'
import { Unit } from '../unit/types'

export type GetListGroupCommentsResponse = BasePaginationResponse<GroupComment[]>

export type GetGroupCommentsQuery = {
  courseId?: number
  unitId?: number
  unpaged?: boolean
}

export type GroupComment = {
  blockId: string
  courseInfo: Course
  unitInfo: Unit
  lectureInfo?: Lecture
  assignmentInfo?: Assignment
  commentInfo: Comment[]
} & BaseData
