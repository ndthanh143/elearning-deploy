import React, { useRef, useEffect } from 'react'
import Box, { BoxProps } from '@mui/material/Box'

interface ContentEditableProps extends Omit<BoxProps, 'value' | 'onChange'> {
  placeholder: string
  defaultValue?: string
  value: string
  onChange: (value: string) => void
}

export const ContentEditable: React.FC<ContentEditableProps> = ({
  placeholder,
  value,
  onChange,
  minHeight = 150,
  width = 600,
  sx,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Set the initial placeholder
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.textContent = value || placeholder
    }
  }, [value, placeholder])

  const handleFocus = () => {
    if (value === '' && contentRef.current) {
      contentRef.current.textContent = ''
    }
  }

  const handleBlur = () => {
    if (contentRef.current && contentRef.current.textContent === '') {
      !value && onChange('')
      contentRef.current.textContent = placeholder
    } else if (contentRef.current) {
      onChange(contentRef.current.textContent || '')
    }
  }

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.textContent || '')
    }
  }

  return (
    <Box
      component='div'
      contentEditable
      ref={contentRef}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      sx={{
        width: width,
        minHeight: minHeight,
        padding: 2,
        borderRadius: 4,
        '&:focus': {
          outline: 'none',
          borderColor: 'primary.main',
        },
        ...sx,
      }}
    />
  )
}
