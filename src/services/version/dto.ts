import { BasePaginationResponse } from '../common/base.dto'
import { Version } from '../course/course.dto'

export type GetVersionResponse = BasePaginationResponse<Version[]>

export type ChangeStatePayload = {
  note?: string
  state: number
  versionId: number
}
