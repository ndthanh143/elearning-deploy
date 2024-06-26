import { Submission } from '../assignmentSubmission/assignmentSubmission.dto'
import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '../common/base.dto'

export type AssignmentResponse = BaseResponse<Assignment>
export type AssignmentsResponse = BasePaginationResponse<Assignment[]>

export type Assignment = {
  assignmentContent: string
  assignmentTitle: string
  assignmentType: number
  endDate: Date | null
  startDate: Date
  state: number
  urlDocument: string
  assignmentSubmissionInfo: Submission[]
} & BaseData

export type CreateAssignmentPayload = {
  assignmentContent: string
  assignmentTitle: string
  endDate?: string
  startDate?: string
  state: number
  urlDocument?: string
}

export type UpdateAssignmentPayload = {
  assignmentContent?: string
  assignmentTitle: string
  assignmentType?: number
  endDate?: string
  startDate?: string
  state: number
  urlDocument?: string
  id: number
}

export type GetListAssignmentQuery = {
  courseId?: number
} & PaginationQuery

export type GetScheduleQuery = {
  startDate: string
  endDate: string
}

export type GetScheduleAssignmentResponse = BaseResponse<AssignmentSchedule[]>

export type AssignmentSchedule = {
  assignmentTitle: string
  courseId: number
  courseName: string
  endDate: string
  id: number
  startDate: string
  unitId: number
  unitName: string
}
