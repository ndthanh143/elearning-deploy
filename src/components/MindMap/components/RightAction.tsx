import { CustomTooltip } from '@/components'
import { useAlert, useBoolean } from '@/hooks'
import {
  AssignmentActions,
  LectureActions,
  ModalSection,
  QuizActions,
  SectionModalProps,
} from '@/pages/Teacher/PlanningPage/modals'
import { ResourceActions } from '@/pages/Teacher/PlanningPage/modals/ResourceActions'
import { CreateAssignmentPayload } from '@/services/assignment/assignment.dto'
import { assignmentService } from '@/services/assignment/assignment.service'
import { CreateLecturePayload } from '@/services/lecture/lecture.dto'
import { lectureService } from '@/services/lecture/lecture.service'
import { quizService } from '@/services/quiz/quiz.service'
import { CreateResourcePayload } from '@/services/resource/resource.dto'
import { resourceService } from '@/services/resource/resource.service'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { CreateUnitPayload } from '@/services/unit/types'
import { AddCircleRounded, ArticleRounded, AssignmentRounded, QuizRounded, UploadRounded } from '@mui/icons-material'
import { IconButton, Stack } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useReactFlow } from 'reactflow'

interface IRightActionProps {
  lessonPlanId: number
}

const xPos = 200
const yPos = 50
export function RightAction({ lessonPlanId }: IRightActionProps) {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const { fitView } = useReactFlow()
  const { value: isOpenAddSection, setTrue: openAddSection, setFalse: closeAddSection } = useBoolean()
  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()

  const { mutate: mutateCreateUnit } = useMutation({
    mutationFn: unitService.create,
    onSuccess: (payload) => {
      closeAddSection()
      fitView({
        nodes: [{ id: payload.id.toString() }],
        duration: 500,
        minZoom: 1,
        maxZoom: 1,
      })

      const toastMessage = 'Create unit successfully!'

      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
      toast.success(toastMessage)
    },
  })

  const { mutate: mutateCreateLecture } = useMutation({
    mutationFn: lectureService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('lecture')
    },
  })

  const { mutate: mutateCreateResource } = useMutation({
    mutationFn: resourceService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('resource')
    },
  })

  const {
    mutate: mutateCreateQuiz,
    data: quiz,
    reset,
  } = useMutation({
    mutationFn: quizService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('quiz')
    },
  })

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

  const { mutate: mutateCreateAssignment } = useMutation({
    mutationFn: assignmentService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('assignment')
    },
  })

  const handleCreateSection = (data: SectionModalProps) => {
    const newPosition = {
      x: 0,
      y: 0,
    }

    const payload: CreateUnitPayload = {
      name: data.name,
      description: data.description,
      lessonPlanId,
      position: newPosition,
    }

    mutateCreateUnit(payload)
  }

  const handleAssignmentActions = (payload: CreateAssignmentPayload) => {
    mutateCreateAssignment({
      ...payload,
      lessonPlanId: Number(lessonPlanId),
      position: {
        x: xPos + 200,
        y: yPos + 50,
      },
    })
  }

  const handleLectureActions = (payload: CreateLecturePayload) => {
    mutateCreateLecture({
      ...payload,
      lessonPlanId: Number(lessonPlanId),
      position: {
        x: xPos + 200,
        y: yPos + 50,
      },
    })
  }

  const handleResourceActions = (payload: CreateResourcePayload) => {
    mutateCreateResource({
      ...payload,
      lessonPlanId: Number(lessonPlanId),
      position: {
        x: xPos + 200,
        y: yPos + 50,
      },
    })
  }

  const handleQuizActions = () => {
    mutateCreateQuiz({
      quizTitle: 'Quiz example...',
      attemptNumber: 0,
      quizTimeLimit: 0,
      isPublicAnswer: true,
      lessonPlanId: Number(lessonPlanId),
      position: {
        x: xPos + 200,
        y: yPos + 50,
      },
    })
  }

  const listButtonsProps = {
    section: {
      title: 'Add new section',
      icon: <AddCircleRounded />,
      onClick: openAddSection,
    },
    lecture: {
      title: 'Add new lecture',
      icon: <ArticleRounded />,
      onClick: openLecture,
    },
    resource: {
      title: 'Upload new File',
      icon: <UploadRounded />,
      onClick: openResource,
    },
    quiz: {
      title: 'Add new quiz',
      icon: <QuizRounded />,
      onClick: handleQuizActions,
    },
    assignment: {
      title: 'Add new assignment',
      icon: <AssignmentRounded />,
      onClick: openAssignment,
    },
  }

  return (
    <>
      <Stack
        p={1}
        gap={1}
        position='absolute'
        right={10}
        top='50%'
        bgcolor='white'
        border={1}
        borderColor={'#ededed'}
        borderRadius={8}
        sx={{ transform: 'translateY(-50%)' }}
        zIndex={10}
      >
        {Object.entries(listButtonsProps).map(([key, value]) => (
          <CustomTooltip title={value.title} key={key} placement='left'>
            <IconButton onClick={value.onClick} color='primary'>
              {value.icon}
            </IconButton>
          </CustomTooltip>
        ))}
      </Stack>

      <ModalSection isOpen={isOpenAddSection} onClose={closeAddSection} onSubmit={handleCreateSection} />
      <ResourceActions isOpen={isOpenResource} onClose={closeResource} onCreate={handleResourceActions} />
      <AssignmentActions isOpen={isOpenAssignment} onClose={closeAssignment} onCreate={handleAssignmentActions} />
      <LectureActions isOpen={isOpenLecture} onClose={closeLecture} onCreate={handleLectureActions} />
      {quiz && <QuizActions isOpen onClose={reset} defaultData={quiz} />}
    </>
  )
}
