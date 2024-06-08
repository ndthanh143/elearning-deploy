import { forwardRef } from 'react'
import { Box, BoxProps } from '@mui/material'

export type DangerouseLyRenderLectureProps = BoxProps & {
  content: string
}

export const DangerouseLyRenderLecture = forwardRef<HTMLDivElement, DangerouseLyRenderLectureProps>(
  ({ content, ...props }, ref) => {
    return (
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
        ref={ref}
        {...props}
      />
    )
  },
)

DangerouseLyRenderLecture.displayName = 'DangerouseLyRenderLecture'
