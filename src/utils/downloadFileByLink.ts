import { configs } from '../configs'

export const downloadFileByLink = (urlDocument: string) =>
  window.open(`${configs.API_URL}/api/file/download${urlDocument}`, '_blank')
