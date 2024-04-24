import { CommentOutlined } from '@mui/icons-material'
import { Box, BoxProps, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'

export type DangerouseLyRenderLectureProps = BoxProps & {
  content: string
  onCreateComment: () => void
}

export const DangerouseLyRenderLecture = ({ onCreateComment, content, ...props }: DangerouseLyRenderLectureProps) => {
  const [showCommentButton, setShowCommentButton] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const targetComponent = document.getElementById('content-container')
    const elements = targetComponent?.childNodes || []

    const mouseOverHandler = (e: any) => {
      e.target.style.color = '#ccc'
      const rect = e.target.getBoundingClientRect()
      setButtonPosition({ top: rect.top, left: rect.left - 40 }) // Position button to the left of the element
      setShowCommentButton(true)
    }

    const mouseOutHandler = (e: any) => {
      e.target.style.color = '' // Reset style
      // setShowCommentButton(false)
    }

    elements.forEach((element) => {
      element.addEventListener('mouseover', mouseOverHandler)
      element.addEventListener('mouseout', mouseOutHandler)
    })

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('mouseover', mouseOverHandler)
        element.removeEventListener('mouseout', mouseOutHandler)
      })
    }
  }, [content])
  return (
    <>
      <Box
        id='content-container'
        dangerouslySetInnerHTML={{ __html: content }}
        sx={{
          h1: {
            fontSize: '2.3rem',
            color: '#0f172a',
            lineHeight: 1.4,
          },
          h2: {
            fontSize: '1.7rem',
            my: 2,
            color: '#0f172a',
            lineHeight: 1.4,
          },
          h3: {
            color: '#0f172a',
            lineHeight: 1.4,
          },
          p: {
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: '#334155',
          },
          li: {
            ml: 3,
          },
          img: {
            width: '60%',
            display: 'flex',
            margin: 'auto',
          },
        }}
        {...props}
      />
      {showCommentButton && (
        <IconButton
          sx={{
            position: 'absolute',
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            zIndex: 10,
          }}
          onClick={onCreateComment}
          size='small'
        >
          <CommentOutlined fontSize='small' />
        </IconButton>
      )}
    </>
  )
}
