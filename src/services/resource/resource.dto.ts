import { BaseData, BaseResponse } from '../common/base.dto'

export type GetResourceResponse = BaseResponse<Resource>

export type Resource = {
  title: string
  urlDocument: string
  resourceTrackingInfo?: {
    id: number
  }
  state: 'PROCESSING' | 'FAILED' | 'DONE'
  contentType: string
  duration: number
  thumbnail?: string
} & BaseData

export type CreateResourcePayload = {
  title: string
  urlDocument: string
}

export type CreateResourceUnitPayload = {
  lessonPlanId: number
  parentId?: number
  position?: {
    x: number
    y: number
  }
} & CreateResourcePayload

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

export type GetResourceDetailParams = {
  courseId?: number
  resourceId: number
  unitId?: number
}
