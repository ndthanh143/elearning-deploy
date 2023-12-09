import { BoxContent } from '@/components'
import { QuizSubmission } from '@/services/quizSubmission/dto'
import { convertMilisecond } from '@/utils'
import { CloseOutlined, VisibilityOutlined } from '@mui/icons-material'
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export type ModalAttemptsProps = {
  data: QuizSubmission[]
  onClose: () => void
}

export const ModalAttempts = ({ data, onClose }: ModalAttemptsProps) => {
  const navigate = useNavigate()

  const handleReviewAttempts = (submissionId: number) => {
    onClose()
    navigate(`/quiz-submission/${submissionId}`)
  }

  return (
    <Modal open sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BoxContent sx={{ minWidth: '80%', maxHeight: '80vh', overflow: 'scroll' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5' fontWeight={500}>
            Your attempts
          </Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Table sx={{ minWidth: '100%', maxHeight: '100px', overflow: 'scroll' }}>
          <TableHead sx={{ width: '100%' }}>
            <TableCell>No</TableCell>
            <TableCell align='center'>Total time</TableCell>
            <TableCell align='center'>Score</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index}</TableCell>
                <TableCell align='center'>{convertMilisecond(item.totalTime)}</TableCell>
                <TableCell align='center'>{Number(item.score).toFixed(2)}</TableCell>
                <TableCell align='right'>
                  <Tooltip title='Review'>
                    <Button variant='outlined' onClick={() => handleReviewAttempts(item.id)}>
                      <VisibilityOutlined />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </BoxContent>
    </Modal>
  )
}
