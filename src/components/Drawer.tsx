import { Box } from '@mui/material'
import { DetailsHTMLAttributes, PropsWithChildren, forwardRef, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

interface IDrawerProps extends PropsWithChildren<DetailsHTMLAttributes<HTMLDivElement>> {
  isOpen: boolean
  onClose: () => void
}

export const Drawer = forwardRef<HTMLDivElement, IDrawerProps>(function Drawer(
  { isOpen, onClose, children, ...props },
  ref,
) {
  const containerRef = useRef(document.createElement('div')) // Container for the portal
  useEffect(() => {
    // Append the container to the body on mount
    document.body.appendChild(containerRef.current)

    return () => {
      // Remove the container from the body when the component unmounts
      document.body.removeChild(containerRef.current)
    }
  }, [])

  return ReactDOM.createPortal(
    <Box
      ref={ref}
      sx={{
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? 1 : 0,
        width: isOpen ? 375 : 0, // Drawer width
        height: '100vh', // Full viewport height
        position: 'fixed',
        right: 0, // Stick to the right side of the viewport
        top: 0,
        bgcolor: 'background.paper', // Using theme color
        boxShadow: 3,
        overflowX: 'hidden', // Prevent horizontal scrolling
        transition: 'opacity 0.3s ease, width 0.3s ease', // Smooth transitions
        zIndex: 1200, // Proper Z-index for overlay
      }}
      {...props}
    >
      {children}
    </Box>,
    containerRef.current, // Mounting the Box inside the created div element
  )
})
