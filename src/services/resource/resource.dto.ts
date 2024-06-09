import { BaseData, BaseResponse } from '../common/base.dto'

export type GetResourceResponse = BaseResponse<Resource>

export type Resource = {
  title: string
  urlDocument: string
  resourceTrackingInfo?: {
    id: number
  }
} & BaseData

export type CreateResourcePayload = {
  title: string
  urlDocument: string
}

export type UpdateResourcePayload = {
  id: number
  title: string
  urlDocument: string
}

export type CreateTrackingResourcePayload = {
  courseId: number
  resourceId: number
  unitId: number
}
