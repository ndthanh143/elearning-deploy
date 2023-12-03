import { BaseData, BaseResponse } from '../common/base.dto'

export type AssignmentResponse = BaseResponse<Assignment>

export type Assignment = {
  assignmentContent: string
  assignmentTitle: string
  assignmentType: number
  endDate: string | null
  startDate: string
  state: number
  urlDocument: string
} & BaseData
