import { BasePaginationResponse } from '../common/base.dto'

export type ActivityData = {
  id: number
  userId: number
  day: string
  totalHours: number
}

export type ActivityResponse = BasePaginationResponse<ActivityData[]>
