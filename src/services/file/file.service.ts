import axiosInstance from '../../axios'

export const fileService = {
  downloadFile: async (urlDocument: string) => {
    const { data } = await axiosInstance.get(`file/download${urlDocument}`)
    return data
  },
}
