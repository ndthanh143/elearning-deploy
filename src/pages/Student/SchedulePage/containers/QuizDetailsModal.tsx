import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { Event } from 'react-big-calendar'
import { Button, Divider, Modal, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { QuizSchedule } from '@/services/quiz/quiz.dto'
import { Flex, IconContainer } from '@/components'
import { AssignmentSchedule } from '@/services/assignment/assignment.dto'
import { icons } from '@/assets/icons'

interface IQuizDetailsModalProps {
  event: Event
  open: boolean
  onClose: () => void
  data: QuizSchedule | AssignmentSchedule
  type: 'quiz' | 'assignment'
}

const typeLink = {
  quiz: { link: 'quiz', text: 'Quiz details', icon: icons['quiz'] },
  assignment: {
    link: 'assign',
    text: 'Assignment details',
    icon: icons['assignment'],
  },
}

export const QuizDetailsModal = ({ data, type, event, open, onClose }: IQuizDetailsModalProps) => {
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate(`/courses/${data.courseId}/u/${data.unitId}/${typeLink[type].link}/${data.id}`)
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <DialogContent sx={{ bgcolor: 'white', borderRadius: 3, maxWidth: 500 }}>
        <Flex gap={1}>
          {typeLink[type].icon}
          <Typography>{typeLink[type].text}</Typography>
        </Flex>
        <Divider sx={{ my: 2 }} />
        <Stack gap={2} sx={{ minWidth: 400 }}>
          <Flex gap={1} justifyContent='center'>
            <IconContainer isActive>{icons['title']}</IconContainer>
            <Typography gutterBottom textAlign='center' variant='body2'>
              <b>{event.title}</b>
            </Typography>
          </Flex>
          <Flex gap={1} justifyContent='center'>
            <IconContainer isActive>{icons['calendar']}</IconContainer>
            <Typography gutterBottom textAlign='center' variant='body2'>
              <b>{dayjs(event.start).format('LLL')}</b>
            </Typography>
          </Flex>
          <Flex gap={1} justifyContent='center'>
            <IconContainer isActive>{icons['deadline']}</IconContainer>
            <Typography gutterBottom textAlign='center' variant='body2'>
              <b>{dayjs(event.end).format('LLL')}</b>
            </Typography>
          </Flex>
          <Button fullWidth variant='contained' onClick={handleNavigate}>
            View details
          </Button>
        </Stack>
      </DialogContent>
    </Modal>
  )
}
