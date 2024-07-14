import axiosInstance from '@/axios'
import { ChangeStatePayload, GetVersionResponse } from './dto'
import Cookies from 'js-cookie'

export const versionService = {
  getList: async (query: any) => {
    const adminAccessToken = Cookies.get('admin_access_token')

    const { data } = await axiosInstance.get<GetVersionResponse>('/version/list', {
      params: { ...query },
      headers: {
        ...(adminAccessToken && { Authorization: `Bearer ${adminAccessToken}` }),
      },
    })
    return data.data
  },
  requestPublish: async ({ versionId }: { versionId: number }) => {
    await axiosInstance.post('/version/request-public', { versionId })
  },

  changeState: async (payload: ChangeStatePayload) => {
    const adminAccessToken = Cookies.get('admin_access_token')

    await axiosInstance.post('/version/change-state', payload, {
      headers: {
        ...(adminAccessToken && { Authorization: `Bearer ${adminAccessToken}` }),
      },
    })
  },

  cancelRequestPublish: async ({ versionId }: { versionId: number }) => {
    const adminAccessToken = Cookies.get('admin_access_token')

    await axiosInstance.post(
      '/version/cancel-request-public',
      { versionId },
      {
        headers: {
          ...(adminAccessToken && { Authorization: `Bearer ${adminAccessToken}` }),
        },
      },
    )
  },
}
