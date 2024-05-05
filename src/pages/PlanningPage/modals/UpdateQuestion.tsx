import { Anwser, AnwserCreate, QuizQuestion, UpdateQuestionPayload } from '@/services/quizQuestion/quizQuestion.dto'
import { gray } from '@/styles/theme'
import { CloseOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { ChangeEvent, useState } from 'react'

type CreateQuestionProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: UpdateQuestionPayload) => void
  defaultQuestion: QuizQuestion
}
export const UpdateQuestion = ({ isOpen, defaultQuestion, onClose, onSave }: CreateQuestionProps) => {
  const [questionContent, setQuestionContent] = useState(defaultQuestion.questionContent)
  const [questionType, setQuestionType] = useState<number>(defaultQuestion.questionType)
  const [answers, setAnwsers] = useState<Anwser[]>(defaultQuestion.answers)

  const addAnwser = () => {
    const newAnwsers = { answerContent: 'anwser', isCorrect: false, id: 0 }

    setAnwsers((prev) => [...prev, newAnwsers])
  }

  const handleRemoveAnwser = (anwser: AnwserCreate) => {
    const newAnwsers = answers.filter((item) => item !== anwser)

    setAnwsers(newAnwsers)
  }

  const handleChangeCorrect = (e: ChangeEvent<HTMLInputElement>) => {
    const updateAnwser = answers.map((item, index) =>
      Number(e.target.value) === index ? { ...item, isCorrect: true } : { ...item, isCorrect: false },
    )

    setAnwsers(updateAnwser)
  }

  const handleCheckBoxAnwser = (index: number) => {
    answers[index].isCorrect = true
  }

  const handleSubmit = () => {
    onSave({ id: defaultQuestion.id, answers, questionContent, questionType })
    setQuestionContent('')
    setQuestionType(1)
    setAnwsers([])
  }

  const handleChangeAnswer = (index: number, value: string) => {
    answers[index].answerContent = value
  }

  return (
    isOpen && (
      <Stack border={1} p={2} borderRadius={3} borderColor={gray[300]}>
        <Stack>
          <Stack direction='row' gap={2}>
            <TextField
              placeholder='Type question...'
              size='small'
              fullWidth
              defaultValue={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
            />
            <Select
              size='small'
              defaultValue={questionType}
              onChange={(e) => setQuestionType(e.target.value as number)}
            >
              <MenuItem value={1}>Single choice</MenuItem>
              <MenuItem value={2}>Multiple choice</MenuItem>
            </Select>
          </Stack>
        </Stack>
        <Stack gap={2} my={2}>
          <Box
            component={questionType === 1 ? RadioGroup : 'div'}
            onChange={questionType === 1 ? handleChangeCorrect : undefined}
          >
            {answers.map((item, index) => (
              <Stack direction='row' gap={2} alignItems='center'>
                <Tooltip title='Choose correct anwser'>
                  {questionType === 1 ? (
                    <Radio value={index} checked={item.isCorrect} />
                  ) : (
                    <Checkbox onChange={() => handleCheckBoxAnwser(index)} checked={item.isCorrect} />
                  )}
                </Tooltip>
                <TextField
                  size='small'
                  variant='standard'
                  placeholder='anwser'
                  fullWidth
                  defaultValue={item.answerContent}
                  onChange={(e) => handleChangeAnswer(index, e.target.value)}
                />
                <IconButton onClick={() => handleRemoveAnwser(item)}>
                  <CloseOutlined />
                </IconButton>
              </Stack>
            ))}
          </Box>
        </Stack>
        <Button variant='outlined' sx={{ width: 'fit-content', mt: 2 }} onClick={addAnwser}>
          Add Anwser
        </Button>
        <Stack direction='row' gap={1} justifyContent='end'>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='contained' onClick={handleSubmit} disabled={answers.length <= 2 || !questionContent}>
            Save
          </Button>
        </Stack>
      </Stack>
    )
  )
}
