import { CustomTooltip } from '@/components'
import { useBoolean } from '@/hooks'
import { AssignmentActions, LectureActions, ModalSection, SectionModalProps } from '@/pages/Teacher/PlanningPage/modals'
import { ResourceActions } from '@/pages/Teacher/PlanningPage/modals/ResourceActions'
import { assignmentService } from '@/services/assignment/assignment.service'
import { lectureService } from '@/services/lecture/lecture.service'
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
      console.log('payload', payload)
      fitView({
        nodes: [{ id: payload.id.toString() }],
        duration: 500,
        minZoom: 1,
        maxZoom: 1,
      })

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
        lessonPlanId: lessonPlanId,
        description: data.lectureName,
        name: data.lectureName,
        lectureId: data.id,
        position: {
          x: xPos,
          y: yPos,
        },
      })
    },
  })

  const { mutate: mutateCreateResource } = useMutation({
    mutationFn: resourceService.create,
    onSuccess: (data) => {
      mutateCreateUnit({
        lessonPlanId,
        description: data.title,
        name: data.title,
        resourceId: data.id,
        position: {
          x: xPos,
          y: yPos,
        },
      })
    },
  })

  const { mutate: mutateCreateAssignment } = useMutation({
    mutationFn: assignmentService.create,
    onSuccess: (data) => {
      mutateCreateUnit({
        lessonPlanId,
        description: data.assignmentContent,
        name: data.assignmentTitle,
        assignmentId: data.id,
        position: {
          x: xPos,
          y: yPos,
        },
      })
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
      onClick: () => {},
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
      <ResourceActions isOpen={isOpenResource} onClose={closeResource} onCreate={mutateCreateResource} />
      <AssignmentActions isOpen={isOpenAssignment} onClose={closeAssignment} onCreate={mutateCreateAssignment} />
      <LectureActions isOpen={isOpenLecture} onClose={closeLecture} onCreate={mutateCreateLecture} />
    </>
  )
}
