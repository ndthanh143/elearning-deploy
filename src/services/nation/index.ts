import axiosInstance from '@/axios'

export const nationService = {
  getList: async () => {
    const { data } = await axiosInstance.get('nation/list')
    return data.data
  },
}
