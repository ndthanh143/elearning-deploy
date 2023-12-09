export const convertMilisecond = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const remainingMinutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const remainingSeconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

  let resultText = ''

  if (hours) {
    resultText += hours + 'h' + ' '
  }
  if (remainingMinutes) {
    resultText += remainingMinutes + 'm' + ' '
  }

  if (remainingSeconds) {
    resultText += remainingSeconds + 's'
  }

  return resultText
}
