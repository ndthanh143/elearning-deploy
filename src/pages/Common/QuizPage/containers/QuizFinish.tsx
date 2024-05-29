import { BoxContent } from '@/components'
import { convertMilisecond } from '@/utils'
import { Button, Divider, Modal, Stack, Typography } from '@mui/material'

export type QuizFinishProps = {
  totalAnwser: number
  totalQuestion: number
  totalTime: number
  onReview: () => void
}

export const QuizFinish = ({ totalAnwser, totalQuestion, totalTime, onReview }: QuizFinishProps) => {
  return (
    <Modal open={true} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent maxWidth={500} textAlign='center' display='flex' flexDirection='column' gap={2}>
        <Typography variant='h5' fontWeight={500}>
          Congratulations on completing the quiz!
        </Typography>
        <Typography>
          Well done! You've successfully finished the quiz, showcasing your knowledge and skills. Your commitment to
          learning and your achievements are truly commendable.
        </Typography>
        <Divider />
        <Stack>
          <Typography>
            Total anwser: {totalAnwser}/{totalQuestion}
          </Typography>
          <Typography>Total time: {convertMilisecond(totalTime)} minutes</Typography>
        </Stack>
        <Button variant='contained' onClick={onReview}>
          Review
        </Button>
      </BoxContent>
    </Modal>
  )
}
