import axios from 'axios'
import axiosInstance from '../../axios'
import { FileData, UploadFilePayload, UploadFileResponse } from './file.dto'
import Cookies from 'js-cookie'
import { configs } from '@/configs'

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
  uploadVideoFile: async (payload: UploadFilePayload) => {
    const { file, type } = payload

    const formData = new FormData()
    formData.append('file', file as any)
    formData.append('type', type)
    const accessToken = Cookies.get('access_token')
    const { data } = await axios.post<UploadFileResponse>(`${configs.VITE_API_UPLOAD_VIDEO}/v1/file/upload`, formData, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })

    return data
  },
}
