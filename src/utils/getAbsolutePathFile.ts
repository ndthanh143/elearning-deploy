import { configs } from '@/configs'

export const getAbsolutePathFile = (urlDocument: string) => {
  return urlDocument ? `${configs.API_URL}/api/file/download${urlDocument}` : undefined
}
