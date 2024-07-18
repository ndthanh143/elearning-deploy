import { BaseResponse } from '../common/base.dto'

export type UploadFileResponse = BaseResponse<UploadFileData>

export type UploadFileData = {
  filePath: string
  contentType: string
}

export enum UploadEnumType {
  LOGO = 'LOGO',
  AVATAR = 'AVATAR',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  THUMBNAIL = 'THUMBNAIL',
  SUBMISSION_FILE = 'SUBMISSION_FILE',
  VIDEO = 'VIDEO',
}
export type UploadFilePayload = {
  file: File
  type: 'LOGO' | 'AVATAR' | 'IMAGE' | 'DOCUMENT' | 'THUMBNAIL' | 'SUBMISSION_FILE' | 'VIDEO'
}

export interface FileData {
  description: string
  file: File
  filename: string
  inputStream: InputStream
  open: boolean
  readable: boolean
  uri: URI
  url: URL
}

export interface File {
  absolute: boolean
  absolutePath: string
  canonicalPath: string
  directory: boolean
  file: boolean
  freeSpace: number
  hidden: boolean
  name: string
  parent: string
  path: string
  totalSpace: number
  usableSpace: number
}

export interface InputStream {}

export interface URI {
  absolute: boolean
  authority: string
  fragment: string
  host: string
  opaque: boolean
  path: string
  port: number
  query: string
  rawAuthority: string
  rawFragment: string
  rawPath: string
  rawQuery: string
  rawSchemeSpecificPart: string
  rawUserInfo: string
  scheme: string
  schemeSpecificPart: string
  userInfo: string
}

export interface URL {
  authority: string
  content: InputStream
  defaultPort: number
  file: string
  host: string
  path: string
  port: number
  protocol: string
  query: string
  ref: string
  userInfo: string
}
