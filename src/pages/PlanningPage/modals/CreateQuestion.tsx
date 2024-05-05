import { ConfirmPopup } from '@/components'
import {
  Anwser,
  AnwserCreate,
  CreateQuestionPayload,
  QuizQuestion,
  UpdateQuestionPayload,
} from '@/services/quizQuestion/quizQuestion.dto'
import { gray } from '@/styles/theme'
import { CloseOutlined } from '@mui/icons-material'
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import { ChangeEvent, useState } from 'react'

type CreateQuestionProps = {
  onClose: () => void
  onSave?: (payload: CreateQuestionPayload) => void
  onUpdate?: (payload: UpdateQuestionPayload) => void
  onDelete?: (id: number) => void
  quizId: number
  index?: number
  status: 'edit' | 'view' | 'create'
  defaultQuestion?: QuizQuestion
}
export const CreateQuestion = ({
  quizId,
  defaultQuestion,
  onClose,
  onUpdate,
  onSave,
  status,
  onDelete = () => {},
}: CreateQuestionProps) => {
  const [selectedDeleteQuestion, setSelectedDeleteQuestion] = useState<number | null>(null)
  const [questionContent, setQuestionContent] = useState(defaultQuestion?.questionContent || '')
  const [questionType, setQuestionType] = useState<number>(defaultQuestion?.questionType || 1)
  const [statuss, setStatus] = useState<'edit' | 'view' | 'create'>(status)
  const [answers, setAnwsers] = useState<Anwser[]>(
    defaultQuestion?.answers || [
      { id: 0, answerContent: '', isCorrect: false },
      { id: 0, answerContent: '', isCorrect: false },
      { id: 0, answerContent: '', isCorrect: false },
      { id: 0, answerContent: '', isCorrect: false },
    ],
  )

  const addAnwser = () => {
    const newAnwsers: Anwser = { answerContent: '', isCorrect: false, id: 0 }

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
    onSave && onSave({ quizId, answers, questionContent, questionType })
    onUpdate && defaultQuestion && onUpdate({ id: defaultQuestion.id, answers, questionContent, questionType })
    setQuestionContent('')
    setQuestionType(1)
    setAnwsers([])
    setStatus('view')
  }

  const handleChangeAnswer = (index: number, value: string) => {
    answers[index].answerContent = value
  }

  return (
    <Badge
      badgeContent={1}
      color='primary'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Stack border={1} p={2} borderRadius={3} sx={{ width: '100%' }} borderColor={gray[200]}>
        <Stack>
          <Stack direction='row' gap={2}>
            <TextField
              placeholder='Type question...'
              size='small'
              fullWidth
              value={questionContent}
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
                    <Radio value={index} />
                  ) : (
                    <Checkbox onChange={() => handleCheckBoxAnwser(index)} />
                  )}
                </Tooltip>

                <InputBase
                  size='small'
                  placeholder='anwser...'
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
        <Divider sx={{ my: 2 }} />
        <Stack direction='row' gap={1} justifyContent='center'>
          {statuss === 'edit' ? (
            <>
              <Button onClick={() => (status === 'edit' ? onClose() : setStatus('view'))} variant='outlined' fullWidth>
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={handleSubmit}
                disabled={answers.length <= 2 || !questionContent}
                fullWidth
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => defaultQuestion && setSelectedDeleteQuestion(defaultQuestion.id)}
                variant='outlined'
                fullWidth
                color='error'
              >
                Delete
              </Button>
              <Button onClick={() => setStatus('edit')} variant='contained' fullWidth>
                Edit
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      <ConfirmPopup
        isOpen={Boolean(selectedDeleteQuestion)}
        onClose={() => setSelectedDeleteQuestion(null)}
        onAccept={() => selectedDeleteQuestion && onDelete(selectedDeleteQuestion)}
        title='Are you sure to delete this question'
        subtitle='This action can not be undo'
      />
    </Badge>
  )
}
