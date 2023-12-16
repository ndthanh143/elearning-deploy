import { Submission } from '../assignmentSubmission/assignmentSubmission.dto'
import { BaseData, BaseResponse } from '../common/base.dto'

export type AssignmentResponse = BaseResponse<Assignment>

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
  modulesId: number
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
