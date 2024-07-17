import { ConfirmPopup, LoadingButton } from '@/components'
import { useAlert } from '@/hooks'
import {
  Anwser,
  AnwserCreate,
  CreateQuestionPayload,
  QuizQuestion,
  UpdateQuestionPayload,
} from '@/services/quizQuestion/quizQuestion.dto'
import { quizQuestionKey } from '@/services/quizQuestion/quizQuestion.query'
import { quizQuestionService } from '@/services/quizQuestion/quizQuestion.service'
import { gray } from '@/styles/theme'
import {
  AddRounded,
  CheckBoxOutlined,
  CheckCircleOutline,
  CheckCircleRounded,
  CloseOutlined,
} from '@mui/icons-material'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify'

type QuestionBoxProps = {
  onClose: () => void
  onSave?: (payload: CreateQuestionPayload) => void
  onUpdate?: (payload: UpdateQuestionPayload) => void
  onDelete?: (id: number) => void
  quizId: number
  index?: number
  status: 'edit' | 'view' | 'create'
  defaultQuestion?: QuizQuestion
  isLoading?: boolean
}
export const QuestionBox = ({
  quizId,
  defaultQuestion,
  onUpdate,
  onSave,
  status: defaultStatus,
  index,
  isLoading,
}: QuestionBoxProps) => {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const [selectedDeleteQuestion, setSelectedDeleteQuestion] = useState<number | null>(null)
  const [questionContent, setQuestionContent] = useState(defaultQuestion?.questionContent || '')
  const [questionType, setQuestionType] = useState<number>(defaultQuestion?.questionType || 1)
  const [status, setStatus] = useState<'edit' | 'view' | 'create'>(defaultStatus)

  const { mutate: mutateDeleteQuestion } = useMutation({
    mutationFn: quizQuestionService.delete,
    onSuccess: () => {
      // const newData = questions?.filter((question) => question.id !== selectedDeleteQuestion) || []
      // queryClient.setQueryData(quizQuestionsInstance.queryKey, newData)

      queryClient.invalidateQueries({ queryKey: quizQuestionKey.lists() })
    },
    onError: () => {
      toast.error('Can not delete this question, this quiz had submission before')
    },
  })

  const [answers, setAnwsers] = useState<Anwser[]>(
    defaultQuestion?.answers || Array(4).fill({ id: 0, answerContent: '', isCorrect: false }),
  )

  console.log('answers', answers)

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
    setAnwsers([...answers])
  }

  const handleSubmit = () => {
    const isSettedCorrectAnswer = answers.some((item) => item.isCorrect)

    if (!isSettedCorrectAnswer) {
      triggerAlert('Please set correct answer', 'error')
      return
    }

    if (status === 'edit' && onUpdate && defaultQuestion) {
      onUpdate({ id: defaultQuestion.id, answers, questionContent, questionType })
      setStatus('view')
    }

    if (status === 'create' && onSave) {
      onSave({ quizId, answers, questionContent, questionType })
    }
  }

  const handleChangeAnswer = (index: number, value: string) => {
    const newAnswer = answers
    newAnswer[index].answerContent = value
    setAnwsers(newAnswer)
  }
  const handleCancelEditQuestion = () => {
    if (defaultQuestion) {
      const newAnswer = defaultQuestion.answers
      setAnwsers(newAnswer)
      setQuestionContent(defaultQuestion.questionContent)
      setQuestionType(defaultQuestion.questionType)
    }
    setStatus('view')
  }

  const isAllAnswerFilled = answers.every((item) => !!item.answerContent)

  return (
    <Badge
      badgeContent={index}
      color='primary'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{ width: '100%' }}
    >
      <Stack border={1} p={2} borderRadius={3} sx={{ width: '100%' }} borderColor={gray[200]}>
        <Stack>
          <Stack direction='row' gap={2}>
            <TextField
              placeholder='Type question...'
              size='small'
              fullWidth
              multiline
              maxRows={3}
              disabled={status === 'view'}
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
            />
            <Select
              sx={{ borderRadius: 2 }}
              size='small'
              disabled={status === 'view'}
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
              <Stack direction='row' gap={2} alignItems='center' key={item.id}>
                <Tooltip title='Choose correct anwser'>
                  {questionType === 1 ? (
                    <Radio
                      value={index}
                      defaultChecked={item.isCorrect}
                      checkedIcon={<CheckCircleRounded color='success' />}
                      disabled={status === 'view'}
                      icon={item.isCorrect ? <CheckCircleRounded color={'success'} /> : <CheckCircleOutline />}
                      sx={{
                        opacity: item.isCorrect ? 1 : 0.4,
                        ':hover': {
                          opacity: 1,
                        },
                      }}
                    />
                  ) : (
                    <Checkbox
                      onChange={() => handleCheckBoxAnwser(index)}
                      disabled={status === 'view'}
                      defaultChecked={item.isCorrect}
                      checkedIcon={<CheckBoxOutlined color='success' />}
                      icon={<CheckBoxOutlined />}
                      sx={{
                        opacity: item.isCorrect ? 1 : 0.4,
                        ':hover': {
                          opacity: 1,
                        },
                      }}
                    />
                  )}
                </Tooltip>

                <InputBase
                  size='small'
                  placeholder='anwser...'
                  fullWidth
                  disabled={status === 'view'}
                  defaultValue={item.answerContent}
                  onChange={(e) => handleChangeAnswer(index, e.target.value)}
                />
                {['create', 'edit'].includes(status) && (
                  <IconButton onClick={() => handleRemoveAnwser(item)}>
                    <CloseOutlined />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Box>
        </Stack>
        {['create', 'edit'].includes(status) && (
          <Button
            variant='outlined'
            sx={{ width: 'fit-content', mt: 2 }}
            onClick={addAnwser}
            startIcon={<AddRounded />}
          >
            Add Anwser
          </Button>
        )}
        <Divider sx={{ my: 2 }} />
        <Stack direction='row' gap={1} justifyContent='center'>
          {['create', 'edit'].includes(status) ? (
            <>
              <Button onClick={handleCancelEditQuestion} variant='outlined' fullWidth disabled={isLoading}>
                Cancel
              </Button>
              <LoadingButton
                variant='contained'
                onClick={handleSubmit}
                disabled={answers.length <= 2 || !questionContent || !isAllAnswerFilled}
                fullWidth
                isLoading={isLoading}
              >
                Save
              </LoadingButton>
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
        onAccept={() => selectedDeleteQuestion && mutateDeleteQuestion(selectedDeleteQuestion)}
        title='Are you sure to delete this question'
        subtitle='This action can not be undo'
        type='delete'
      />
    </Badge>
  )
}
