import rehypeSanitize from 'rehype-sanitize'
import MDEditor from '@uiw/react-md-editor'
import { fileService } from '@/services/file/file.service'

export interface EditorProps {
  value?: string
  onChange: (value: string) => void
}

const onImagePasted = async (dataTransfer: DataTransfer, setMarkdown: (value: string) => void) => {
  const files: File[] = []
  for (let index = 0; index < dataTransfer.items.length; index += 1) {
    const file = dataTransfer.files.item(index)

    if (file) {
      files.push(file)
    }
  }

  await Promise.all(
    files.map(async (file: any) => {
      const data = await fileService.upload({ file, type: 'IMAGE' })

      const insertedMarkdown = insertToTextArea(`![](${data.data.filePath})`)
      if (!insertedMarkdown) {
        return
      }
      setMarkdown(insertedMarkdown)
    }),
  )
}

const insertToTextArea = (intsertString: string) => {
  const textarea = document.querySelector('textarea')
  if (!textarea) {
    return null
  }

  let sentence = textarea.value
  const len = sentence.length
  const pos = textarea.selectionStart
  const end = textarea.selectionEnd

  const front = sentence.slice(0, pos)
  const back = sentence.slice(pos, len)

  sentence = front + intsertString + back

  textarea.value = sentence
  textarea.selectionEnd = end + intsertString.length

  return sentence
}

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <MDEditor
      value={value}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      height='100%'
      preview='edit'
      onChange={(value) => value && onChange(value)}
      onPaste={async (event) => {
        await onImagePasted(event.clipboardData, onChange)
      }}
      onDrop={async (event) => {
        await onImagePasted(event.dataTransfer, onChange)
      }}
    />
  )
}
