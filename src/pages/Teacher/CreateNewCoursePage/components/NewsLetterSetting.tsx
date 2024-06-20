import Editor from '@/components/ContentEditor/ContentEditor'
import { Stack, Typography } from '@mui/material'
import { CreateCourseForm } from '.'

interface INewsLetterSettingProps {
  form: CreateCourseForm
}
export function NewsLetterSetting({ form }: INewsLetterSettingProps) {
  const { setValue, watch } = form

  return (
    <Stack gap={4}>
      <Stack>
        <Typography variant='h3' fontWeight={700}>
          Newsletter for your course
        </Typography>
        <Typography variant='body2'>
          You can write messages to students (optional) to encourage student engagement with course content. This
          message will be automatically sent when they join or complete the course. If you don't want to send a welcome
          or congratulatory message, leave this text box blank.
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography fontWeight={700}>Welcome message</Typography>
        <Editor onChange={(value) => setValue('welcome', value)} value={watch('welcome')} />
      </Stack>

      <Stack gap={1}>
        <Typography fontWeight={700}>Congratulation message</Typography>
        <Editor onChange={(value) => setValue('congratulation', value)} value={watch('congratulation')} />
      </Stack>
    </Stack>
  )
}
