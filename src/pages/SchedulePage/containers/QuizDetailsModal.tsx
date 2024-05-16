import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { Event } from 'react-big-calendar'

interface IQuizDetailsModalProps {
  quiz: Event
  open: boolean
  onClose: () => void
}

export const QuizDetailsModal = ({ quiz, open, onClose }: IQuizDetailsModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Quiz Details</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>Title: {quiz.title}</Typography>
        <Typography gutterBottom>Start: {dayjs(quiz.start).format('LLL')}</Typography>
        <Typography gutterBottom>End: {dayjs(quiz.end).format('LLL')}</Typography>
      </DialogContent>
    </Dialog>
  )
}
