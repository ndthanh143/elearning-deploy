import { Assignment } from '../assignment/assignment.dto'
import { BaseData, BasePaginationResponse, PaginationQuery } from '../common/base.dto'
import { Account } from '../user/user.dto'

export type SubmissionsResponse = BasePaginationResponse<Submission[]>

export type GetSubmissionQuery = {
  studentId?: number
  assignmentId?: number
  courseId?: number
} & PaginationQuery

export type CreateSubmissionPayload = {
  assignmentId: number
  courseId: number
  fileSubmissionUrl?: string
  textSubmission?: string
  linkSubmission?: string
}

export type Submission = {
  score?: number
  assignmentInfo: Assignment
  fileSubmissionUrl?: string
  textSubmission?: string
  linkSubmission?: string
  studentInfo: Account
} & BaseData

export type UpdateSubmissionPayload = {
  id: number
  fileSubmissionUrl?: string
  textSubmission?: string
  linkSubmission?: string
  score?: number
}
