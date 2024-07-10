import { CustomModal, CustomTooltip } from '@/components'
import { QuizSubmission } from '@/services/quizSubmission/dto'
import { convertMilisecond } from '@/utils'
import { VisibilityOutlined } from '@mui/icons-material'
import { Button, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export type ModalAttemptsProps = {
  data: QuizSubmission[]
  onClose: () => void
  isReviewAble?: boolean
  isOpen: boolean
}

export const ModalAttempts = ({ data, isOpen, isReviewAble, onClose }: ModalAttemptsProps) => {
  const navigate = useNavigate()

  const handleReviewAttempts = (submissionId: number) => {
    onClose()
    navigate(`/quiz-submission/${submissionId}`)
  }

  return (
    <CustomModal title='Your attempts' onClose={onClose} isOpen={isOpen} maxWidth={600}>
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
                <CustomTooltip title='Review your answers'>
                  <Button variant='outlined' onClick={() => handleReviewAttempts(item.id)}>
                    <VisibilityOutlined />
                  </Button>
                </CustomTooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CustomModal>
  )
}
