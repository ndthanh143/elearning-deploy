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
  username: string
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

export type RequestForgotPasswordPayload = {
  email: string
  roleKind: number // Student: 3, Teacher: 2
}

export type VerifyOtpPayload = {
  otp: string
  resetHash: string
}

export type VerifyOtpResponse = BaseResponse<{ verified: boolean; verifiedToken: string }>

export type RequestForgotPasswordResponse = BaseResponse<{ resetHash: string }>

export type ResetPasswordPayload = {
  newPassword: string
  verifiedToken: string
}
