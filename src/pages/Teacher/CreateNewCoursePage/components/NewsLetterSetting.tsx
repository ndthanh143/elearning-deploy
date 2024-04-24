import { Flex } from '@/components'
import Editor from '@/components/Editor'
import { Button, Divider, Stack, Typography } from '@mui/material'
import { CreateCourseForm } from '..'

interface INewsLetterSettingProps {
  form: CreateCourseForm
  onSubmit: () => void
}
export function NewsLetterSetting({ form, onSubmit }: INewsLetterSettingProps) {
  const { setValue } = form

  return (
    <Stack gap={4}>
      <Stack gap={1}>
        <Typography variant='h5' fontWeight={700}>
          Newsletter for your course
        </Typography>
        <Typography>
          You can write messages to students (optional) to encourage student engagement with course content. This
          message will be automatically sent when they join or complete the course. If you don't want to send a welcome
          or congratulatory message, leave this text box blank.
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography fontWeight={700}>Welcome message</Typography>
        <Editor onChange={(value) => setValue('welcome', value)} />
      </Stack>

      <Stack gap={1}>
        <Typography fontWeight={700}>Congratulation message</Typography>
        <Editor onChange={(value) => setValue('congratulation', value)} />
      </Stack>
      <Divider />
      <Flex justifyContent='end'>
        <Button variant='contained' onClick={onSubmit}>
          Submit
        </Button>
      </Flex>
    </Stack>
  )
}
