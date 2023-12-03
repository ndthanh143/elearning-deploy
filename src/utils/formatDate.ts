import dayjs from 'dayjs'

export const formatDate = {
  toCommon: (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY')
  },
  toDateTime: (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY hh:mm')
  },
}
