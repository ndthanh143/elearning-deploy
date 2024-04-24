import { useState, MouseEvent, MutableRefObject } from 'react'

interface UseMenuOutput {
  anchorEl: HTMLElement | null
  isOpen: boolean
  onOpen: (event: MouseEvent<HTMLElement>) => void
  onClose: () => void
}

export const useMenu = (ref?: MutableRefObject<HTMLDivElement | null>): UseMenuOutput => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(ref?.current || null)
  const isOpen = Boolean(anchorEl)

  const onOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(ref?.current || event.currentTarget)
  }
  const onClose = () => {
    setAnchorEl(null)
  }

  return { anchorEl, isOpen, onOpen, onClose }
}
