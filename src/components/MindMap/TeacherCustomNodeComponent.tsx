import { useBoolean } from '@/hooks'
import {
  AssignmentActions,
  LectureActions,
  ModalSection,
  QuizActions,
  SectionModalProps,
} from '@/pages/Teacher/PlanningPage/modals'
import { ResourceActions } from '@/pages/Teacher/PlanningPage/modals/ResourceActions'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { CreateUnitPayload, Unit } from '@/services/unit/types'
import {
  AddCircleOutlineOutlined,
  ArticleOutlined,
  AssignmentOutlined,
  FileUploadOutlined,
  LibraryAddOutlined,
  QuizOutlined,
} from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'
import { DrawerNodeDetail } from './components'
import { MutableRefObject } from 'react'
import { lectureService } from '@/services/lecture/lecture.service'
import { assignmentService } from '@/services/assignment/assignment.service'
import { resourceService } from '@/services/resource/resource.service'
import { primary } from '@/styles/theme'
import { quizService } from '@/services/quiz/quiz.service'
import dayjs from 'dayjs'
import { CustomTooltip } from '..'

export const TeacherCustomNodeComponent = (
  props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement>; index: number }>,
) => {
  const queryClient = useQueryClient()

  const { fitView } = useReactFlow()

  const { value: isOpenAddSection, setTrue: openAddSection, setFalse: closeAddSection } = useBoolean()

  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()

  // const { value: isOpenSectionModal, setTrue: openSectionModal, setFalse: closeSectionModal } = useBoolean()
  // const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const {
    data: { parentRef, index, ...unit },
    xPos,
    yPos,
    selected,
  } = props

  if (index === 0) {
    fitView({
      nodes: [{ id: unit.id.toString() }],
      duration: 500,
      minZoom: 1,
      maxZoom: 1,
    })
  }

  const { value: isOpenDrawer, setFalse: closeDrawer } = useBoolean(true)

  const { mutate: mutateCreateUnit } = useMutation({
    mutationFn: unitService.create,
    onSuccess: (payload) => {
      closeAddSection()

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

  const {
    mutate: mutateCreateQuiz,
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

  const { mutate: mutateCreateLecture } = useMutation({
    mutationFn: lectureService.create,
    onSuccess: (data) => {
      mutateCreateUnit({
        lessonPlanId: Number(unit.lessonPlanInfo?.id),
        description: data.lectureName,
        parentId: unit.id,
        name: data.lectureName,
        lectureId: data.id,
        position: {
          x: xPos + 200,
          y: yPos + 50,
        },
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
        position: {
          x: xPos + 200,
          y: yPos + 50,
        },
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
        position: {
          x: xPos + 200,
          y: yPos + 50,
        },
      })
    },
  })

  const handleCreateSection = (data: SectionModalProps) => {
    const newPosition = {
      x: xPos,
      y: yPos + 200,
    }

    const payload: CreateUnitPayload = {
      name: data.name,
      description: data.description,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
      parentId: unit.id,
      position: newPosition,
    }

    mutateCreateUnit(payload)
  }

  const handleAddQuiz = () => {
    mutateCreateQuiz({
      quizTitle: 'Quiz 1',
      modulesId: unit.id,
      attemptNumber: 0,
      endDate: dayjs().toISOString(),
      quizTimeLimit: 0,
      startDate: dayjs().toISOString(),
      isPublicAnswer: true,
    })
  }

  const listButtons = {
    section: {
      icon: <LibraryAddOutlined />,
      onClick: openAddSection,
      tooltip: 'Add new Section',
    },
    lecture: {
      icon: <ArticleOutlined />,
      onClick: openLecture,
      tooltip: 'Add new lecture',
    },
    resource: {
      icon: <FileUploadOutlined />,
      onClick: openResource,
      tooltip: 'Upload new File',
    },
    quiz: {
      icon: <QuizOutlined />,
      onClick: handleAddQuiz,
      tooltip: 'Add new quiz',
    },
    assignment: {
      icon: <AssignmentOutlined />,
      onClick: openAssignment,
      tooltip: 'Add new assignment',
    },
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: 4,
          width: 200,
          border: '1px solid',
          borderColor: blue[500],
          minHeight: 50,
          fontSize: 12,
          px: 4,
          py: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.2s ease-in-out',
          zIndex: 10,
          filter: selected ? `drop-shadow(0 0 0.75rem ${primary[500]})` : 'none',
        }}
      >
        <Typography variant='body2' textAlign={'center'}>
          {unit.name}
        </Typography>

        <Handle
          type='source'
          id='a'
          position={Position.Bottom}
          style={{
            background: primary[100],
            border: 1,
            position: 'absolute',
            zIndex: 1,
          }}
        />

        <Handle
          type='target'
          position={Position.Top}
          style={{ background: primary[100], border: 1, position: 'absolute', zIndex: 1 }}
        />

        {selected && (
          <Box
            className='add-node'
            sx={{
              mt: 2,
              position: 'absolute',
              top: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <Box width={4} height={40} bgcolor='#F79B8D' />
            <AddCircleOutlineOutlined sx={{ color: '#F79B8D' }} />
            <Box p={4} border={1} borderRadius={4} borderColor='primary.main' bgcolor='white'>
              <Typography textAlign='center' color='#000' fontWeight={700} mb={2}>
                Add new Subject
              </Typography>
              <Stack direction='row' gap={2}>
                {Object.entries(listButtons).map(([key, button]) => (
                  <CustomTooltip title={button.tooltip} key={key}>
                    <IconButton
                      onClick={button.onClick}
                      sx={{
                        border: 1,
                        ':hover': {
                          color: 'primary.main',
                        },
                        borderRadius: '50%',
                      }}
                    >
                      {button.icon}
                    </IconButton>
                  </CustomTooltip>
                ))}
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
      <ResourceActions isOpen={isOpenResource} onClose={closeResource} onCreate={mutateCreateResource} />
      <AssignmentActions isOpen={isOpenAssignment} onClose={closeAssignment} onCreate={mutateCreateAssignment} />
      <LectureActions isOpen={isOpenLecture} onClose={closeLecture} onCreate={mutateCreateLecture} />
      <ModalSection isOpen={isOpenAddSection} onClose={closeAddSection} onSubmit={handleCreateSection} />
      {quiz && <QuizActions isOpen onClose={reset} defaultData={quiz} />}
      <DrawerNodeDetail isOpen={isOpenDrawer && selected} onClose={closeDrawer} unit={unit} />
    </>
  )
}
