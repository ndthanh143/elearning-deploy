import { BaseData, BaseResponse } from '../common/base.dto'

export type UserResponse = BaseResponse<Account>

export type Account = {
  fullName: string
  avatarPath: string
  email: string
  isSuperAdmin: boolean
  kind: number
  roleInfo: Role
} & BaseData

export type Role = {
  description: string
  kind: number
  name: string
}
