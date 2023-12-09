import { Dayjs } from 'dayjs'

export const getWeekDates = (selectedDay: Dayjs): Dayjs[] => {
  let startOfWeek = selectedDay.startOf('week')
  const endOfWeek = selectedDay.endOf('week')
  const weekDates: Dayjs[] = []

  while (startOfWeek.isBefore(endOfWeek)) {
    weekDates.push(startOfWeek)
    startOfWeek = startOfWeek.add(1, 'day')
  }

  return weekDates
}
