import { BasePaginationResponse } from '../common/base.dto'
import { GroupTask } from '../groupTask/dto'

export type GetListSubmissionResponse = BasePaginationResponse<TaskSubmission[]>

export type TaskSubmission = {
  id: number
  fileUrl: string
  groupTaskInfo: GroupTask
}
