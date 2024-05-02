import { useBoolean } from '@/hooks'
import {
  ArticleOutlined,
  AssignmentOutlined,
  DeleteOutline,
  EditOutlined,
  FileUploadOutlined,
  QuizOutlined,
} from '@mui/icons-material'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { ModalSection, AssignmentActions, LectureActions, QuizActions, SectionModalProps } from '../modals'
import { ResourceActions } from '../modals/ResourceActions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { quizService } from '@/services/quiz/quiz.service'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Quiz } from '@/services/quiz/quiz.dto'
import { ConfirmPopup, ModalLoading } from '@/components'
import { moduleKey } from '@/services/module/module.query'
import { toast } from 'react-toastify'
import { Unit } from '@/services/unit/types'
import { unitService } from '@/services/unit'
type ActionsModuleProps = {
  data: Unit
}

export const ActionsModule = ({ data: unit }: ActionsModuleProps) => {
  const queryClient = useQueryClient()

  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()
  const { value: isOpenSectionModal, setTrue: openSectionModal, setFalse: closeSectionModal } = useBoolean()
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const [quiz, setQuiz] = useState<Quiz | null>(null)

  const { mutate: mutateCreateQuiz, isPending: isPendingCreateQuiz } = useMutation({
    mutationFn: quizService.create,
    onSuccess: (quiz) => {
      setQuiz(quiz.data)
    },
  })

  const handleCloseQuiz = () => setQuiz(null)

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: unitService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleKey.lists() })
      toast.success('Update Section successfully')
      closeSectionModal()
    },
  })

  const { mutate: mutateDelete } = useMutation({
    mutationFn: unitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleKey.lists() })
      toast.success('Delete Section successfully')
      closeSectionModal()
    },
  })

  const handleUpdateSecion = (data: SectionModalProps) => {
    mutateUpdate({ ...data, id: unit.id })
  }

  const handleDelete = () => {
    mutateDelete(unit.id)
  }

  const handleAddQuiz = () => {
    mutateCreateQuiz({
      quizTitle: 'Quiz 1',
      modulesId: unit.id,
      attemptNumber: 0,
      endDate: dayjs().toISOString(),
      quizTimeLimit: 0,
      startDate: dayjs().toISOString(),
    })
  }

  return (
    <>
      <Stack direction='row' justifyContent='space-between'>
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
        <Stack direction='row' gap={2}>
          <Tooltip title='Update module'>
            <IconButton
              sx={{
                border: 1,
                ':hover': {
                  color: 'primary.main',
                },
                borderRadius: '50%',
              }}
              onClick={openSectionModal}
            >
              <EditOutlined color='primary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete module'>
            <IconButton
              sx={{
                border: 1,
                ':hover': {
                  color: 'primary.main',
                },
                borderRadius: '50%',
              }}
              onClick={openConfirm}
            >
              <DeleteOutline color='error' />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <ModalSection
        status='update'
        isOpen={isOpenSectionModal}
        onClose={closeSectionModal}
        defaultValues={unit}
        onSubmit={handleUpdateSecion}
      />

      {/* <ResourceActions status='create' isOpen={isOpenResource} onClose={closeResource} />
      <LectureActions status='create' isOpen={isOpenLecture} onClose={closeLecture} />
      <AssignmentActions status='create' isOpen={isOpenAssignment} onClose={closeAssignment} /> */}
      {quiz && <QuizActions isOpen onClose={handleCloseQuiz} defaultData={quiz} />}
      <ConfirmPopup
        title='Confirm delete'
        subtitle='Are you sure to delete this section, all relative data will be remove.'
        onClose={closeConfirm}
        isOpen={isOpenConfirm}
        onAccept={handleDelete}
      />
      <ModalLoading isOpen={isPendingCreateQuiz} />
    </>
  )
}
