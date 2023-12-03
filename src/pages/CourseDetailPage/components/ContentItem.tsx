import { ArticleOutlined, CheckCircle, CircleOutlined } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'

export type ContentItemProps = {
  type: 'assignment' | 'lecture' | 'resource'
  iconUrl?: string
  title: string
  onClick: () => void
  status?: 'done' | 'pending'
}

export const ContentItem = ({ iconUrl, title, onClick, status = 'pending' }: ContentItemProps) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      py={2}
      sx={{
        cursor: 'pointer',
        ':hover': {
          color: 'primary.main',
        },
      }}
      onClick={onClick}
    >
      <Stack direction='row' gap={2}>
        {iconUrl ? <Box component='img' src={iconUrl} alt={title} width={25} /> : <ArticleOutlined color='primary' />}
        <Typography>{title}</Typography>
      </Stack>
      {status === 'done' ? <CheckCircle color='success' /> : <CircleOutlined color='success' />}
    </Box>
  )
}
