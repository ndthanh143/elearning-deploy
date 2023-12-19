import ReactQuill from 'react-quill'
import { Box } from '@mui/material'
import { useRef } from 'react'

export interface EditorProps {
  value?: string
  onChange: (value: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  // return (
  //   <MDEditor
  //     value={value}
  //     previewOptions={{
  //       rehypePlugins: [[rehypeSanitize]],
  //     }}
  //     height='100%'
  //     preview='edit'
  //     onChange={(value) => value && onChange(value)}
  //     onPaste={async (event) => {
  //       await onImagePasted(event.clipboardData, onChange)
  //     }}
  //     onDrop={async (event) => {
  //       await onImagePasted(event.dataTransfer, onChange)
  //     }}
  //   />
  // )

  const quillRef = useRef<ReactQuill>(null)

  // const handleImageUpload = () => {
  //   const editor = quillRef.current?.getEditor()

  //   const input = document.createElement('input')
  //   input.setAttribute('type', 'file')
  //   input.setAttribute('accept', 'image/*')
  //   input.click()

  //   input.onchange = async () => {
  //     const file = input.files?.[0]
  //     if (file) {
  //       try {
  //         const response = await fileService.upload({
  //           file: file as any,
  //           type: 'IMAGE',
  //         })

  //         const imageUrl = getAbsolutePathFile(response.data.filePath)

  //         if (editor) {
  //           const range = editor.getSelection()
  //           editor?.insertEmbed(range?.index || 0, 'image', imageUrl)
  //         }
  //       } catch (error) {
  //         console.error('Image upload failed', error)
  //       }
  //     }
  //   }
  // }

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  }

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
      height='90%'
      maxWidth='100vw'
      overflow='hidden'
      component={ReactQuill}
      theme='snow'
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder='Write something...'
    />
  )
}
