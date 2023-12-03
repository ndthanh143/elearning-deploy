import { BoxContent } from '@/components'
import { AddOutlined } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'

export type SubmissionContentProps = {
  assignmentId?: string
}

export const SubmissionContent = ({ assignmentId }: SubmissionContentProps) => {
  return (
    <BoxContent>
      <Stack gap={2}>
        <Typography variant='h5'>Bài tập của bạn</Typography>
        <Button fullWidth variant='outlined'>
          <AddOutlined />
          <Typography>Thêm hoặc tạo</Typography>
        </Button>
        <Button variant='contained' fullWidth>
          Đánh dấu là đã hoàn thành
        </Button>
      </Stack>
    </BoxContent>
  )
}
