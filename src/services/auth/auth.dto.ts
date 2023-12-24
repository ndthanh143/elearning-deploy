import { BaseResponse } from '../common/base.dto'

export type AuthLoginResponse = BaseResponse<AuthLoginData>

export enum RoleEnum {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

export type AuthLoginData = {
  fullName: string
  token: string
  avatar: string
  expiresIn: number
  role: RoleEnum | null
}

export type LoginAdminPayload = {
  email: string
  password: string
}
