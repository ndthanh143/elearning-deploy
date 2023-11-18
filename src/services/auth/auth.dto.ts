import { BaseResponse } from '../common/base.dto'

export type AuthGoogleLoginResponse = BaseResponse<AuthGoogleLoginData>

export enum RoleEnum {
  Student = 'Student',
}

export type AuthGoogleLoginData = {
  fullName: string
  token: string
  avatar: string
  expiresIn: number
  role: RoleEnum | null
}
