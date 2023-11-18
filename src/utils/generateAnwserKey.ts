export const generateAwnserKey = (index: number) => {
  if (index >= 0 && index <= 25) {
    const answerKey = String.fromCharCode('A'.charCodeAt(0) + index)
    return answerKey
  } else {
    return 'Invalid'
  }
}
