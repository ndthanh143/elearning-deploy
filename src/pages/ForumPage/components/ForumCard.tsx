import common from '@/assets/images/icons/common'
import { Forum } from '@/services/forum/forum.dto'
import { getAbsolutePathFile } from '@/utils'
import { Card, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

interface IForumCardProps {
  data: Forum
}

export function ForumCard({ data }: IForumCardProps) {
  const navigate = useNavigate()

  const handleClickCourse = () => navigate(`/forum/${data.id}`)

  console.log('data', data)
  return (
    <Card
      sx={{
        ':hover': {
          bgcolor: blue[50],
          transition: 'all ease 0.15s',
        },
        cursor: 'pointer',
        transition: 'all ease 0.15s',
      }}
      onClick={handleClickCourse}
      elevation={1}
      variant='outlined'
    >
      <CardMedia
        image={common.course || getAbsolutePathFile(data.courseInfo.thumbnail)}
        sx={{ objectFit: 'cover', height: 200 }}
      />
      <CardContent>
        <Chip label={data.courseInfo.categoryInfo?.categoryName} color='primary' size='small' />
        <Typography variant='h6' mt={1}>
          {data.forumTitle}
        </Typography>
      </CardContent>
    </Card>
  )
}
