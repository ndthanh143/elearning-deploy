import { Submission } from '../assignmentSubmission/assignmentSubmission.dto'
import { BaseData, BasePaginationResponse, BaseResponse, PaginationQuery } from '../common/base.dto'

export type AssignmentResponse = BaseResponse<Assignment>
export type AssignmentsResponse = BasePaginationResponse<Assignment[]>

export type Assignment = {
  assignmentContent: string
  assignmentTitle: string
  assignmentType: number
  endDate?: string | null
  startDate?: string | null
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

export type CreateAssignmentWithUnitPayload = {
  lessonPlanId: number
  parentId?: number
  position?: {
    x: number
    y: number
  }
} & CreateAssignmentPayload

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

export type UpdateAssignmentWithUnitPayload = {
  id: number
  parentId?: number
  position?: {
    x: number
    y: number
  }
} & UpdateAssignmentPayload

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

export type GetAssignmentDetailParams = {
  assignmentId: number
  courseId?: number
  unitId?: number
}
