import { defineQuery } from '../../utils'
import { fileService } from './file.service'

export const fileKeys = {
  all: ['file'] as const,
  details: () => [...fileKeys.all, 'detail'] as const,
  detail: (urlDocument: string) =>
    defineQuery([...fileKeys.details(), urlDocument], () => fileService.downloadFile(urlDocument)),
}
