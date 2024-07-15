import { useAlert, useBoolean } from '@/hooks'
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
import { ConfirmPopup, Flex, ModalLoading } from '@/components'
import { Unit } from '@/services/unit/types'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { lectureService } from '@/services/lecture/lecture.service'
import { resourceService } from '@/services/resource/resource.service'
import { assignmentService } from '@/services/assignment/assignment.service'
import { CreateAssignmentPayload } from '@/services/assignment/assignment.dto'
import { CreateResourcePayload } from '@/services/resource/resource.dto'
import { CreateLecturePayload } from '@/services/lecture/lecture.dto'
type ActionsUnitProps = {
  data: Unit
}

export const ActionsUnit = ({ data: unit }: ActionsUnitProps) => {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()

  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()
  const { value: isOpenSectionModal, setTrue: openSectionModal, setFalse: closeSectionModal } = useBoolean()
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const handleCreateFinish = (type: 'assignment' | 'lecture' | 'quiz' | 'resource' | 'video') => {
    let toastMessage = 'Create unit successfully!'
    switch (type) {
      case 'lecture':
        toastMessage = 'Create lecture successfully!'
        closeLecture()
        break
      case 'assignment':
        toastMessage = 'Create assignment successfully!'
        closeAssignment()
        break
      case 'resource':
        toastMessage = 'Create resource successfully!'
        closeResource()
        break
      case 'quiz':
        toastMessage = 'Create quiz successfully!'
        break
    }

    queryClient.invalidateQueries({ queryKey: unitKey.lists() })
    triggerAlert(toastMessage, 'success')
  }

  const {
    mutate: mutateCreateQuiz,
    isPending: isPendingCreateQuiz,
    data: quiz,
    reset,
  } = useMutation({
    mutationFn: quizService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('quiz')
    },
  })

  const { mutate: mutateCreateLecture, isPending: isLoadingLecture } = useMutation({
    mutationFn: lectureService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('lecture')
    },
  })
  const handleCreateLecture = (payload: CreateLecturePayload) => {
    mutateCreateLecture({
      ...payload,
      parentId: unit.id,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
    })
  }

  const { mutate: mutateCreateResource, isPending: isLoadingAction } = useMutation({
    mutationFn: resourceService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('resource')
    },
  })
  const handleCreateResource = (payload: CreateResourcePayload) => {
    mutateCreateResource({
      ...payload,
      parentId: unit.id,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
    })
  }

  const { mutate: mutateCreateAssignment, isPending: isLoadingAssignment } = useMutation({
    mutationFn: assignmentService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('assignment')
    },
  })

  const handleCreateAssignment = (payload: CreateAssignmentPayload) => {
    mutateCreateAssignment({
      ...payload,
      parentId: unit.id,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
    })
  }

  const { mutate: mutateUpdate, isPending: isLoadingSection } = useMutation({
    mutationFn: unitService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
      triggerAlert('Update Section successfully', 'success')
      closeSectionModal()
    },
  })

  const { mutate: mutateDelete } = useMutation({
    mutationFn: unitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
      triggerAlert('Delete Section successfully', 'success')
      closeSectionModal()
    },
  })

  const handleUpdateSecion = (data: SectionModalProps) => {
    mutateUpdate({ ...data, id: unit.id })
  }

  const handleDelete = () => {
    mutateDelete(unit.id)
  }

  const handleQuizActions = () => {
    mutateCreateQuiz({
      quizTitle: 'Quiz example...',
      attemptNumber: 0,
      quizTimeLimit: 0,
      isPublicAnswer: true,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
      parentId: unit.id,
    })
  }

  return (
    <>
      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='row' gap={2}>
          <Tooltip title='Add new lecture'>
            <IconButton
              color='secondary'
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
              color='secondary'
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
              color='secondary'
              onClick={handleQuizActions}
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
              color='secondary'
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
        <Flex gap={1}>
          <Tooltip title='Update module'>
            <IconButton
              color='secondary'
              sx={{
                ':hover': {
                  color: 'primary.main',
                },
                borderRadius: '50%',
              }}
              onClick={openSectionModal}
            >
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete module'>
            <IconButton
              color='error'
              sx={{
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
        </Flex>
      </Stack>

      <ModalSection
        isOpen={isOpenSectionModal}
        onClose={closeSectionModal}
        defaultValues={unit}
        onSubmit={handleUpdateSecion}
        isLoading={isLoadingSection}
      />

      <LectureActions
        isOpen={isOpenLecture}
        onClose={closeLecture}
        onCreate={handleCreateLecture}
        isLoading={isLoadingLecture}
      />
      <ResourceActions
        isOpen={isOpenResource}
        onClose={closeResource}
        onCreate={handleCreateResource}
        isLoading={isLoadingAction}
      />
      <AssignmentActions
        isOpen={isOpenAssignment}
        onClose={closeAssignment}
        onCreate={handleCreateAssignment}
        isLoading={isLoadingAssignment}
      />

      {quiz && <QuizActions isOpen onClose={reset} defaultData={quiz} />}
      <ConfirmPopup
        title='Confirm delete'
        subtitle='Are you sure to delete this section, all relative data will be remove.'
        onClose={closeConfirm}
        isOpen={isOpenConfirm}
        onAccept={handleDelete}
        type='delete'
      />
      <ModalLoading isOpen={isPendingCreateQuiz} />
    </>
  )
}
