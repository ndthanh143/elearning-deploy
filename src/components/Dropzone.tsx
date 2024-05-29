import React, { useCallback, useState, useRef } from 'react'
import { Box, BoxProps, Typography } from '@mui/material'
import { CloudUploadRounded } from '@mui/icons-material'

interface IDropzoneProps extends BoxProps {
  onFileChange: (file: File) => void
}

export function Dropzone({ onFileChange, sx, ...props }: IDropzoneProps) {
  const [dragging, setDragging] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(true)
  }, [])

  const onDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
  }, [])

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileChange(event.dataTransfer.files[0])

      event.dataTransfer.clearData()
    }
  }, [])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0])
    }
  }

  return (
    <Box
      onClick={() => inputRef.current?.click()}
      sx={{
        border: '1px dashed',
        borderColor: dragging ? 'primary.main' : 'grey.400',
        bgcolor: dragging ? 'action.hover' : 'background.paper',
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        ...sx,
      }}
      borderRadius={3}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      {...props}
    >
      <CloudUploadRounded fontSize='large' color='primary' sx={{ width: 100, height: 100 }} />
      <Typography variant='body1' gutterBottom>
        Click to select a file or drop a file here
      </Typography>
      <input ref={inputRef} type='file' hidden onChange={onChange} />
    </Box>
  )
}
