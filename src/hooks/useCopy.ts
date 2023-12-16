import { useEffect, useState } from 'react'

export interface IUseCopyReturnProps {
  isCopied: boolean
  onCopy: (text: string) => void
  onReset: () => void
}

interface IUseCopyProps {
  autoReset?: boolean
  resetTimout?: number
}

export const useCopy = ({ autoReset = false, resetTimout = 2000 }: IUseCopyProps = {}): IUseCopyReturnProps => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = (text: string): void => {
    navigator.clipboard.writeText(text)

    setIsCopied(true)
  }

  const onReset = () => setIsCopied(false)

  useEffect(() => {
    const timeoutCopy =
      autoReset &&
      setTimeout(() => {
        onReset()
      }, resetTimout)

    return () => {
      timeoutCopy && clearTimeout(timeoutCopy)
    }
  }, [isCopied, autoReset, resetTimout])

  return { isCopied, onCopy, onReset }
}
