import { useRef } from 'react'
import ReactQuill from 'react-quill'
import { Box, BoxProps } from '@mui/material'
import 'react-quill/dist/quill.snow.css'
import { useMutation } from '@tanstack/react-query'
import { fileService } from '@/services/file/file.service'
import { getAbsolutePathFile } from '@/utils'
import 'react-quill/dist/quill.snow.css'

export interface EditorProps extends Omit<BoxProps, 'onChange'> {
  minHeight?: number
  value?: string
  onChange: (value: string) => void
}

export default function ContentEditor({ minHeight, value, onChange, sx, ...props }: EditorProps) {
  const quillRef = useRef<ReactQuill>(null)
  // const [richText, setRichText] = useState('')
  // const [pdfUrl, setPdfUrl] = useState('')
  // const [pdfPages, setPdfPages] = useState([])
  // const [file, setFile] = useState<File | null>(null)

  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     setFile(file)
  //     const pdf = await file.arrayBuffer()
  //     const pdfDoc = await getDocument(pdf).promise
  //     let text = ''
  //     let pages = []

  //     for (let i = 1; i <= pdfDoc.numPages; i++) {
  //       const page = await pdfDoc.getPage(i)
  //       const content = await page.getTextContent()
  //       text += content.items.map((item) => item.str).join(' ') + '\n'
  //       pages.push(page)
  //     }

  //     // setPdfPages(pages)
  //     // const formattedHtml = convertToRichText(text)
  //     // setRichText(formattedHtml)
  //   }
  // }

  // const convertToRichText = (text) => {
  //   const lines = text.split('\n')
  //   let html = ''
  //   let inList = false

  //   lines.forEach((line) => {
  //     const trimmedLine = line.trim()

  //     // Detect headers (simple heuristic: lines with all caps or specific patterns)
  //     if (/^[A-Z\s]+$/.test(trimmedLine) && trimmedLine.length > 0) {
  //       html += `<h2>${trimmedLine}</h2>`
  //     }
  //     // Detect list items
  //     else if (/^\d+\./.test(trimmedLine)) {
  //       if (!inList) {
  //         html += '<ol>'
  //         inList = true
  //       }
  //       html += `<li>${trimmedLine}</li>`
  //     } else if (/^[-*]/.test(trimmedLine)) {
  //       if (!inList) {
  //         html += '<ul>'
  //         inList = true
  //       }
  //       html += `<li>${trimmedLine}</li>`
  //     } else {
  //       if (inList) {
  //         html += inList === 'ol' ? '</ol>' : '</ul>'
  //         inList = false
  //       }
  //       // Detect bold (simple heuristic: text within ** or __)
  //       const boldText = trimmedLine
  //         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  //         .replace(/__(.*?)__/g, '<strong>$1</strong>')
  //       // Detect italic (simple heuristic: text within * or _)
  //       const italicText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/_(.*?)_/g, '<em>$1</em>')
  //       html += `<p>${italicText}</p>`
  //     }
  //   })

  //   if (inList) {
  //     html += inList === 'ol' ? '</ol>' : '</ul>'
  //   }

  //   return html
  // }

  const { mutate: mutateUpload } = useMutation({
    mutationFn: fileService.upload,
    onSuccess: (data) => {
      const editor = quillRef.current?.getEditor()
      const imageUrl = data.data.filePath

      if (editor) {
        const range = editor.getSelection()
        const value = { url: getAbsolutePathFile(imageUrl), width: '300px', height: 'auto' }
        editor?.insertEmbed(range?.index || 0, 'custom-image', value)
      }
    },
    onError: (error) => {
      console.error('Image upload failed', error)
    },
  })

  console.log(mutateUpload)

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
    <>
      {/* <input type='file' accept='application/pdf' onChange={handleFileChange} /> */}
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
    </>
  )
}
