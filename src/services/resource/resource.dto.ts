import { BaseData } from '../common/base.dto'

export type Resource = {
  title: string
  urlDocument: string
} & BaseData

export type CreateResourcePayload = {
  title: string
  modulesId: number
  urlDocument: string
}

export type UpdateResourcePayload = {
  id: number
  title: string
  modulesId: number
  urlDocument: string
}
