import actions from '@/assets/images/icons/actions'
import { useMenu } from '@/hooks'
import { QuizzesInfo } from '@/services/user/user.dto'
import { gray } from '@/styles/theme'
import { formatDate } from '@/utils'
import { AccessTime, MoreHorizOutlined } from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

export type QuizItemProps = {
  isActive?: boolean
  onClick?: () => void
  quizData: QuizzesInfo
}

export const QuizItem = ({ isActive, onClick, quizData }: QuizItemProps) => {
  const navigate = useNavigate()
  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const handleViewInfo = () => {
    navigate(`/courses/${quizData.courseInfo.id}/quiz/${quizData.quizInfo.id}`)
  }
  return (
    <>
      <Stack
        gap={1}
        bgcolor={isActive ? blue[50] : 'transparent'}
        padding={isActive ? 2 : 0}
        borderRadius={3}
        sx={{
          transition: 'all ease 0.2s',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        <Stack direction='row' mb={1} alignItems='center' justifyContent='space-between'>
          {quizData.quizInfo.startDate && quizData.quizInfo.endDate && (
            <Stack direction='row' gap={2} alignItems='center'>
              <Box component='img' src={actions.quiz} width={30} height={30} />
              <Typography variant='body2'>
                {formatDate.toDateTime(new Date(quizData.quizInfo.startDate))} -{' '}
                {formatDate.toDateTime(new Date(quizData.quizInfo.endDate))}
              </Typography>
            </Stack>
          )}
          <IconButton onClick={onOpen}>
            <MoreHorizOutlined />
          </IconButton>
        </Stack>

        <Typography color={gray[800]} fontStyle='italic'>
          {quizData.courseInfo.courseName}
        </Typography>
        <Typography fontWeight={500}>{quizData.quizInfo.quizTitle}</Typography>
        <Typography textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap' maxWidth={500}>
          {quizData.quizInfo.description}
        </Typography>
        <Stack direction='row' gap={1}>
          <AccessTime />
          <Typography>{quizData.quizInfo.quizTimeLimit} minutes</Typography>
        </Stack>
      </Stack>
      <Menu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <MenuItem onClick={handleViewInfo}>View info</MenuItem>
      </Menu>
    </>
  )
}
