import { BasePaginationResponse } from '../common/base.dto'
import { GroupTask } from '../groupTask/dto'

export type GetListSubmissionResponse = BasePaginationResponse<
  {
    id: number
    fileUrl: string
    groupTaskInfo: GroupTask
  }[]
>
