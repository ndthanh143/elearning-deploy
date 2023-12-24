import axiosInstance from '@/axios'

export const roleService = {
  getList: async () => {
    const { data } = await axiosInstance.get('/role/list')

    return data.data
  },
}
