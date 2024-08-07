import { useAlert, useBoolean } from '@/hooks'
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
  ArticleOutlined,
  AssignmentOutlined,
  FileUploadOutlined,
  InfoOutlined,
  LibraryAddOutlined,
  MovingOutlined,
  QuizOutlined,
} from '@mui/icons-material'
import { Box, Grid, Stack, Typography, styled } from '@mui/material'
import { blue, orange } from '@mui/material/colors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Handle, NodeProps, Position, useStore } from 'reactflow'
import { DrawerNodeDetail } from './components'
import { MutableRefObject } from 'react'
import { lectureService } from '@/services/lecture/lecture.service'
import { assignmentService } from '@/services/assignment/assignment.service'
import { resourceService } from '@/services/resource/resource.service'
import { primary } from '@/styles/theme'
import { quizService } from '@/services/quiz/quiz.service'
import { icons } from '@/assets/icons'
import { CreateAssignmentPayload } from '@/services/assignment/assignment.dto'
import { CreateLecturePayload } from '@/services/lecture/lecture.dto'
import { CreateResourcePayload } from '@/services/resource/resource.dto'

const StyledHandle = styled(Handle)(() => ({
  background: primary[100],
  border: 1,
  // position: 'absolute',
  // zIndex: 1,
  // width: '100%',
  // height: '100%',
  width: 10,
  height: 10,
  // top: 0,
  // left: 0,
  // borderRadius: 0,
  // transform: 'none',
  // opacity: 0,
  // ':before': {
  //   content: '""',
  //   position: 'absolute',
  //   top: '-10px',
  //   left: '50%',
  //   height: '20px',
  //   width: '40px',
  //   transform: 'translate(-50%, 0)',
  //   background: ' #d6d5e6',
  //   zIndex: '1000',
  //   lineHeight: 1,
  //   color: '#fff',
  //   fontSize: '9px',
  //   border: '2px solid #222138',
  // },
}))

// const CustomNode = styled(Stack)(() => ({
//   width: '150px',
//   height: '80px',
//   border: '3px solid black',
//   position: 'relative',
//   overflow: 'hidden',
//   borderRadius: '10px',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   fontWeight: 'bold',
//   ':before': {
//     content: '""',
//     position: 'absolute',
//     top: '-10px',
//     left: '50%',
//     height: '20px',
//     width: '40px',
//     transform: 'translate(-50%, 0)',
//     background: '#d6d5e6',
//     zIndex: '1000',
//     lineHeight: 1,
//     borderRadius: '4px',
//     color: '#fff',
//     fontSize: '9px',
//     border: '2px solid #222138',
//   },
// }))

export const TeacherCustomNodeComponent = (
  props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement>; type: 'common' | 'main' }>,
) => {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()

  const {
    data: { parentRef, type, ...unit },
    xPos,
    yPos,
    selected,
  } = props

  const connectionNodeId = useStore((state) => state.connectionNodeId)
  const isConnecting = !!connectionNodeId
  const isTarget =
    connectionNodeId && connectionNodeId !== unit.id.toString() && connectionNodeId !== unit.parent?.id.toString()

  const { value: isOpenAddSection, setTrue: openAddSection, setFalse: closeAddSection } = useBoolean()

  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()
  const { value: isConnectSource, setTrue: setConnectSource } = useBoolean(selected)

  // const { value: isOpenSectionModal, setTrue: openSectionModal, setFalse: closeSectionModal } = useBoolean()
  // const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const { value: isOpenDrawer, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean(false)

  const { mutate: mutateCreateUnit, isPending: isLoadingCreateSection } = useMutation({
    mutationFn: unitService.create,
    onSuccess: () => {
      closeAddSection()

      let toastMessage = 'Create unit successfully!'

      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
      triggerAlert(toastMessage, 'success')
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

  const { mutate: mutateCreateLecture, isPending: isLoadingLecture } = useMutation({
    mutationFn: lectureService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('lecture')
    },
  })

  const { mutate: mutateCreateResource, isPending: isLoadingAction } = useMutation({
    mutationFn: resourceService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('resource')
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

  const { mutate: mutateCreateAssignment, isPending: isLoadingAssignment } = useMutation({
    mutationFn: assignmentService.createWithUnit,
    onSuccess: () => {
      handleCreateFinish('assignment')
    },
  })

  const handleAssignmentActions = (payload: CreateAssignmentPayload) => {
    mutateCreateAssignment({
      ...payload,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
      parentId: unit.id,
      position: {
        x: xPos + 200,
        y: yPos + 50,
      },
    })
  }

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

  const handleLectureActions = (payload: CreateLecturePayload) => {
    mutateCreateLecture({
      ...payload,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
      parentId: unit.id,
      position: {
        x: xPos + 200,
        y: yPos + 50,
      },
    })
  }

  const handleResourceActions = (payload: CreateResourcePayload) => {
    mutateCreateResource({
      ...payload,
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
      parentId: unit.id,
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
      lessonPlanId: Number(unit.lessonPlanInfo?.id),
      parentId: unit.id,
      position: {
        x: xPos + 200,
        y: yPos + 50,
      },
    })
  }

  const listButtons = {
    connection: {
      icon: <MovingOutlined fontSize='small' color='secondary' />,
      onClick: setConnectSource,
      tooltip: 'Connect',
    },
    section: {
      icon: <LibraryAddOutlined fontSize='small' color='secondary' />,
      onClick: openAddSection,
      tooltip: 'Section',
    },
    lecture: {
      icon: <ArticleOutlined fontSize='small' color='secondary' />,
      onClick: openLecture,
      tooltip: 'Lecture',
    },
    resource: {
      icon: <FileUploadOutlined fontSize='small' color='secondary' />,
      onClick: openResource,
      tooltip: 'File',
    },
    quiz: {
      icon: <QuizOutlined fontSize='small' color='secondary' />,
      onClick: handleQuizActions,
      tooltip: 'Quiz',
    },
    assignment: {
      icon: <AssignmentOutlined fontSize='small' color='secondary' />,
      onClick: openAssignment,
      tooltip: 'Assignment',
    },
    info: {
      icon: <InfoOutlined fontSize='small' color='secondary' />,
      onClick: openDrawer,
      tooltip: 'Info',
    },
  }

  return (
    <>
      <Box>
        <Stack
          sx={{
            width: 200,
            minHeight: 50,
            fontSize: 12,
            gap: 1,

            transition: isTarget ? 'all 0.05s ease-in-out' : 'all 0.2s ease-in-out',
            ':hover': {
              borderColor: blue[500],
            },
            zIndex: 10,
            ...(type === 'main'
              ? {
                  backgroundColor: primary[500],
                  color: '#fff',
                  borderRadius: '100%',
                  border: `4px solid ${primary[500]}`,
                  px: 4,
                  py: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }
              : {
                  backgroundColor: isTarget ? orange[200] : '#fff',
                  color: '#000',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: blue[500],
                  minHeight: 50,
                  fontSize: 12,
                  px: 4,
                  py: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }),

            ...(isConnectSource &&
              selected && {
                border: '4px solid',
                borderColor: primary[500],
              }),
          }}
        >
          {type === 'main' && (
            <Box width={50} height={50} bgcolor='#fff' p={1} borderRadius='100%'>
              {icons['planMindmap']}
            </Box>
          )}
          <Typography variant='body2' textAlign={'center'} fontWeight={type === 'main' ? 700 : 400}>
            {unit.name}
          </Typography>

          {!isConnecting && (
            <StyledHandle
              position={Position.Right}
              type='source'
              sx={{
                ...(isConnectSource && selected
                  ? {
                      background: primary[100],
                      border: 1,
                      position: 'absolute',
                      zIndex: 1,
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      borderRadius: 0,
                      transform: 'none',
                      opacity: 0,
                      ':before': {
                        content: '""',
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        height: '20px',
                        width: '40px',
                        transform: 'translate(-50%, 0)',
                        background: ' #d6d5e6',
                        zIndex: '1000',
                        lineHeight: 1,
                        color: '#fff',
                        fontSize: '9px',
                        border: '2px solid #222138',
                      },
                    }
                  : { position: 'absolute', bgcolor: 'transparent' }),
              }}
            />
          )}

          <StyledHandle
            type='target'
            position={Position.Top}
            isConnectableStart={false}
            sx={{
              background: primary[100],
              border: 1,
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              borderRadius: 0,
              transform: 'none',
              opacity: 0,
              ':before': {
                content: '""',
                position: 'absolute',
                top: '-10px',
                left: '50%',
                height: '20px',
                width: '40px',
                transform: 'translate(-50%, 0)',
                background: ' #d6d5e6',
                zIndex: '1000',
                lineHeight: 1,
                color: '#fff',
                fontSize: '9px',
                border: '2px solid #222138',
              },
            }}
          />

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
              visibility: selected ? 'visible' : 'hidden',
              opacity: selected ? 1 : 0,
              transition: 'all 0.2s ease-in-out',
              width: 300,
            }}
          >
            {/* <Box width={4} height={40} bgcolor='#F79B8D' /> */}
            {/* <AddCircleOutlineOutlined sx={{ color: '#F79B8D' }} /> */}
            <Stack py={2} px={2} border={1} borderRadius={4} borderColor='primary.main' bgcolor='white'>
              <Typography textAlign='center' color='#000' fontWeight={700} mb={2}>
                Operations
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(listButtons).map(([key, button]) => (
                  <Grid item xs={4} key={key}>
                    <Stack
                      alignItems='center'
                      sx={{
                        bgcolor: primary[50],
                        borderRadius: 4,
                        cursor: 'pointer',
                        p: 1.5,
                        transition: 'all 0.1s ease-in-out',
                        ':hover': {
                          bgcolor: primary[100],
                        },
                      }}
                      onClick={button.onClick}
                    >
                      {button.icon}
                      <Typography variant='caption' fontWeight={400} color='secondary'>
                        {button.tooltip}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Box>
        </Stack>
        <ResourceActions
          isOpen={isOpenResource}
          onClose={closeResource}
          onCreate={handleResourceActions}
          isLoading={isLoadingAction}
        />
        <AssignmentActions
          isOpen={isOpenAssignment}
          onClose={closeAssignment}
          onCreate={handleAssignmentActions}
          isLoading={isLoadingAssignment}
        />
        <LectureActions
          isOpen={isOpenLecture}
          onClose={closeLecture}
          onCreate={handleLectureActions}
          isLoading={isLoadingLecture}
        />
        <ModalSection
          isOpen={isOpenAddSection}
          onClose={closeAddSection}
          onSubmit={handleCreateSection}
          isLoading={isLoadingCreateSection}
        />
        {quiz && <QuizActions isOpen onClose={reset} defaultData={quiz} />}
        <DrawerNodeDetail isOpen={isOpenDrawer && selected} onClose={closeDrawer} unit={unit} />
      </Box>
    </>
  )
}
