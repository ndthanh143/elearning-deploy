import dayjs from 'dayjs'
import { formatDistance } from 'date-fns'

export const formatDate = {
  toCommon: (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY')
  },
  toDateTime: (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY - hh:mm')
  },
  toRelative: (date: Date) => {
    return formatDistance(date, new Date(), { addSuffix: true })
  },
}
