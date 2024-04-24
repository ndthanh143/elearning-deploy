import { useEffect, useRef, useCallback } from 'react'

export const useOnClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
) => {
  const savedHandler = useRef<(event: MouseEvent | TouchEvent) => void>()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (ref.current && savedHandler.current && !ref.current.contains(event.target as Node)) {
        savedHandler.current(event)
      }
    },
    [ref],
  )

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      handleClickOutside(event)
    }

    const handleGlobalTouch = (event: TouchEvent) => {
      handleClickOutside(event)
    }

    document.addEventListener('mousedown', handleGlobalClick)
    document.addEventListener('touchstart', handleGlobalTouch)

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick)
      document.removeEventListener('touchstart', handleGlobalTouch)
    }
  }, [handleClickOutside])
}
