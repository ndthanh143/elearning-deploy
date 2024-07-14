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
import { ConfirmPopup, Flex, ModalLoading } from '@/components'
import { toast } from 'react-toastify'
import { Unit } from '@/services/unit/types'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { lectureService } from '@/services/lecture/lecture.service'
import { resourceService } from '@/services/resource/resource.service'
import { assignmentService } from '@/services/assignment/assignment.service'
type ActionsUnitProps = {
  data: Unit
}

export const ActionsUnit = ({ data: unit }: ActionsUnitProps) => {
  const queryClient = useQueryClient()

  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()
  const { value: isOpenSectionModal, setTrue: openSectionModal, setFalse: closeSectionModal } = useBoolean()
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const {
    mutate: mutateCreateQuiz,
    isPending: isPendingCreateQuiz,
    data: quiz,
    reset,
  } = useMutation({
    mutationFn: quizService.create,
    onSuccess: (data) => {
      if (data) {
        mutateCreateUnit({
          lessonPlanId: Number(unit.lessonPlanInfo?.id),
          description: data.quizTitle,
          parentId: unit.id,
          name: data.quizTitle,
          quizId: data.id,
        })
      }
    },
  })

  const { mutate: mutateCreateUnit } = useMutation({
    mutationFn: unitService.create,
    onSuccess: (payload) => {
      let toastMessage = 'Create unit successfully!'

      if (payload.lectureInfo) {
        toastMessage = 'Create lecture successfully!'
        closeLecture()
      }
      if (payload.assignmentInfo) {
        toastMessage = 'Create assignment successfully!'
        closeAssignment()
      }
      if (payload.resourceInfo) {
        toastMessage = 'Create resource successfully!'
        closeResource()
      }
      if (payload.quizInfo) {
        toastMessage = 'Create quiz successfully!'
      }

      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
      toast.success(toastMessage)
    },
  })

  const { mutate: mutateCreateLecture } = useMutation({
    mutationFn: lectureService.create,
    onSuccess: (data) => {
      mutateCreateUnit({
        lessonPlanId: Number(unit.lessonPlanInfo?.id),
        description: data.lectureName,
        parentId: unit.id,
        name: data.lectureName,
        lectureId: data.id,
      })
    },
  })

  const { mutate: mutateCreateResource } = useMutation({
    mutationFn: resourceService.create,
    onSuccess: (data) => {
      mutateCreateUnit({
        lessonPlanId: Number(unit.lessonPlanInfo?.id),
        description: data.title,
        parentId: unit.id,
        name: data.title,
        resourceId: data.id,
      })
    },
  })

  const { mutate: mutateCreateAssignment } = useMutation({
    mutationFn: assignmentService.create,
    onSuccess: (data) => {
      mutateCreateUnit({
        lessonPlanId: Number(unit.lessonPlanInfo?.id),
        description: data.assignmentContent,
        parentId: unit.id,
        name: data.assignmentTitle,
        assignmentId: data.id,
      })
    },
  })

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: unitService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
      toast.success('Update Section successfully')
      closeSectionModal()
    },
  })

  const { mutate: mutateDelete } = useMutation({
    mutationFn: unitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
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
      attemptNumber: 0,
      endDate: dayjs().toISOString(),
      quizTimeLimit: 0,
      startDate: dayjs().toISOString(),
      isPublicAnswer: true,
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
      />

      <LectureActions isOpen={isOpenLecture} onClose={closeLecture} onCreate={mutateCreateLecture} />
      <ResourceActions isOpen={isOpenResource} onClose={closeResource} onCreate={mutateCreateResource} />
      <AssignmentActions isOpen={isOpenAssignment} onClose={closeAssignment} onCreate={mutateCreateAssignment} />

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
