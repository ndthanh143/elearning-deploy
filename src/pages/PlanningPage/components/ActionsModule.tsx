import { useBoolean } from '@/hooks'
import { ArticleOutlined, AssignmentOutlined, FileUploadOutlined, QuizOutlined } from '@mui/icons-material'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { AssignmentActions, LectureActions, QuizActions } from '../modals'
import { Module } from '@/services/module/module.dto'
import { ResourceActions } from '../modals/ResourceActions'
import { useMutation } from '@tanstack/react-query'
import { quizService } from '@/services/quiz/quiz.service'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Quiz } from '@/services/quiz/quiz.dto'
import { ModalLoading } from '@/components'
type ActionsModuleProps = {
  module: Module
}

export const ActionsModule = ({ module }: ActionsModuleProps) => {
  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()

  const [quiz, setQuiz] = useState<Quiz | null>(null)

  const { mutate: mutateCreateQuiz, isPending: isPendingCreateQuiz } = useMutation({
    mutationFn: quizService.create,
    onSuccess: (quiz) => {
      setQuiz(quiz.data)
    },
  })

  const handleCloseQuiz = () => setQuiz(null)

  const handleAddQuiz = () => {
    mutateCreateQuiz({
      quizTitle: 'Quiz 1',
      modulesId: module.id,
      attemptNumber: 0,
      endDate: dayjs().toISOString(),
      quizTimeLimit: 0,
      startDate: dayjs().toISOString(),
    })
  }

  return (
    <>
      <Stack direction='row' gap={2}>
        <Tooltip title='Add new lecture'>
          <IconButton
            onClick={openLecture}
            sx={{
              border: 1,
              ':hover': {
                color: 'primary.main',
              },
              borderRadius: '50%',
            }}
          >
            <ArticleOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title='Upload new File'>
          <IconButton
            onClick={openResource}
            sx={{
              border: 1,
              ':hover': {
                color: 'primary.main',
              },
              borderRadius: '50%',
            }}
          >
            <FileUploadOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title='Add new quiz'>
          <IconButton
            onClick={handleAddQuiz}
            sx={{
              border: 1,
              ':hover': {
                color: 'primary.main',
              },
              borderRadius: '50%',
            }}
          >
            <QuizOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title='Add new assignment'>
          <IconButton
            onClick={openAssignment}
            sx={{
              border: 1,
              ':hover': {
                color: 'primary.main',
              },
              borderRadius: '50%',
            }}
          >
            <AssignmentOutlined />
          </IconButton>
        </Tooltip>
      </Stack>
      <ResourceActions status='create' isOpen={isOpenResource} onClose={closeResource} moduleId={module.id} />
      <LectureActions status='create' isOpen={isOpenLecture} onClose={closeLecture} moduleId={module.id} />
      <AssignmentActions status='create' isOpen={isOpenAssignment} onClose={closeAssignment} moduleId={module.id} />
      {quiz && <QuizActions isOpen onClose={handleCloseQuiz} defaultData={quiz} />}

      <ModalLoading isOpen={isPendingCreateQuiz} />
    </>
  )
}
