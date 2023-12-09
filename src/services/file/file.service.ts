import axiosInstance from '../../axios'
import { FileData, UploadFilePayload, UploadFileResponse } from './file.dto'

export const fileService = {
  downloadFile: async (urlDocument: string) => {
    const { data } = await axiosInstance.get<FileData>(`file/download${urlDocument}`)
    return data
  },
  upload: async (payload: UploadFilePayload) => {
    const { file, type } = payload

    const formData = new FormData()
    formData.append('file', file as any)
    formData.append('type', type)

    const { data } = await axiosInstance.post<UploadFileResponse>('file/upload', formData)

    return data
  },
}
