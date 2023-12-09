export const getTimeRemain = (endDate: Date) => {
  const now = new Date().getTime()

  const timeRemaining = endDate.getTime() - now

  if (timeRemaining < 0) {
    const elapsedDays = Math.abs(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)))
    return `Expired ${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago`
  } else {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

    let message = ''
    if (days > 0) {
      message += `${days} ${days === 1 ? 'day' : 'days'} `
    }
    if (hours > 0) {
      message += `${hours} ${hours === 1 ? 'hour' : 'hours'} `
    }
    if (minutes > 0) {
      message += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} `
    }

    return message.trim() === '' ? 'Expired' : `${message.trim()}left`
  }
}
