import { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import { Box, BoxProps } from '@mui/material'
import 'react-quill/dist/quill.snow.css'
import { useMutation } from '@tanstack/react-query'
import { fileService } from '@/services/file/file.service'
import 'react-quill/dist/quill.snow.css'

import { getAbsolutePathFile } from '@/utils'

export interface EditorProps extends Omit<BoxProps, 'onChange'> {
  minHeight?: number
  value?: string
  onChange: (value: string) => void
}

export default function ContentEditor({ minHeight, value, onChange, sx, ...props }: EditorProps) {
  const quillRef = useRef<ReactQuill>(null)

  const { mutate: mutateUpload } = useMutation({
    mutationFn: fileService.upload,
    onSuccess: (data) => {
      const editor = quillRef.current?.getEditor()
      const imageUrl = data.data.filePath

      if (editor) {
        const range = editor.getSelection()
        const value = { url: getAbsolutePathFile(imageUrl), width: '300px', height: 'auto' } // Set your desired width and height
        editor?.insertEmbed(range?.index || 0, 'custom-image', value)
      }
    },
    onError: (error) => {
      console.error('Image upload failed', error)
    },
  })

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        mutateUpload({ file, type: 'IMAGE' })
      }
    }
  }

  useEffect(() => {
    const handleClick = () => {
      const editor = quillRef.current?.getEditor()
      if (editor) {
        editor.focus()
      }
    }

    const container = document.querySelector('.ql-container')
    if (container) {
      container.addEventListener('click', handleClick)
    }

    // Cleanup event listener on component unmount
    return () => {
      if (container) {
        container.removeEventListener('click', handleClick)
      }
    }
  }, [])

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ]

  return (
    <Box
      ref={quillRef}
      component={ReactQuill}
      overflow='scroll'
      theme='snow'
      value={value}
      onChange={onChange}
      modules={{
        toolbar: {
          container: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean'],
          ],
        },

        clipboard: {
          matchVisual: false,
        },
      }}
      formats={formats}
      placeholder='Write something...'
      sx={{
        '.ql-toolbar.ql-snow': {
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
        '.ql-container': {
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          minHeight: minHeight || 400,
          fontSize: 18,
        },
        ...sx,
      }}
      {...props}
    />
  )
}
