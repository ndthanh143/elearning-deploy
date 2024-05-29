import { BaseResponse } from '../common/base.dto'

export type AuthLoginResponse = BaseResponse<AuthLoginData>

export enum RoleEnum {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

export type AuthLoginData = {
  access_token: string
  refresh_token: string
  token_type: string
  user_id: number
  user_kind: number
}

export type LoginAdminPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  avatarPath?: string
  email: string
  fullName: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}
