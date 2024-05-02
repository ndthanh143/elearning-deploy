import { useAuth, useBoolean, useMenu } from '@/hooks'
import {
  AssignmentActions,
  LectureActions,
  ModalSection,
  QuizActions,
  SectionModalProps,
} from '@/pages/PlanningPage/modals'
import { ResourceActions } from '@/pages/PlanningPage/modals/ResourceActions'
import { moduleKey } from '@/services/module/module.query'
import { moduleService } from '@/services/module/module.service'
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
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { blue, green } from '@mui/material/colors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'
import { DrawerNodeDetail } from './components'
import { MutableRefObject } from 'react'
import { lectureService } from '@/services/lecture/lecture.service'
import { assignmentService } from '@/services/assignment/assignment.service'
import { resourceService } from '@/services/resource/resource.service'

type StatusNodeType = 'lock' | 'done' | 'current'

export const TeacherCustomNodeComponent = (
  props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement> }>,
) => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()
  const isTeacher = profile?.data.roleInfo.name === 'Teacher'

  const { value: isOpenAddSection, setTrue: openAddSection, setFalse: closeAddSection } = useBoolean()

  const { value: isOpenLecture, setTrue: openLecture, setFalse: closeLecture } = useBoolean()
  const { value: isOpenAssignment, setTrue: openAssignment, setFalse: closeAssignment } = useBoolean()
  const { value: isOpenResource, setTrue: openResource, setFalse: closeResource } = useBoolean()
  // const { value: isOpenSectionModal, setTrue: openSectionModal, setFalse: closeSectionModal } = useBoolean()
  // const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const {
    data: { parentRef, ...unit },
    xPos,
    yPos,
    selected,
  } = props

  const { value: isOpenDrawer, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean(true)

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

  const { mutate: mutateCreateLecture } = useMutation({
    mutationFn: lectureService.create,
    onSuccess: (data) => {
      mutateCreateUnit({
        lessonPlanId: unit.lessonPlanInfo.id,
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
        lessonPlanId: unit.lessonPlanInfo.id,
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
        lessonPlanId: unit.lessonPlanInfo.id,
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
      lessonPlanId: unit.lessonPlanInfo.id,
      parentId: unit.id,
      position: newPosition,
    }

    mutateCreateUnit(payload)
  }

  let statusNodes: StatusNodeType = 'current'
  if (unit.unlock) {
    statusNodes = 'lock'
  }

  return (
    <>
      <Box
        sx={{
          // position: 'relative',
          backgroundColor: '#F79B8D',
          // boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
          color: 'white',
          borderRadius: 4,
          width: 200,
          // opacity: isDisabled ? 0.5 : 1,
          minHeight: 50,
          fontSize: 12,
          px: 4,
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.2s ease-in-out',
          border: '4px solid',
          borderColor: selected ? blue[500] : 'transparent',
          ':hover': {
            borderColor: blue[500],
          },
          zIndex: 10,
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
            background: isTeacher ? '#F1D1C3' : 'transparent',
            border: isTeacher ? 1 : 0,
            position: 'absolute',
            zIndex: 1,
          }}
        />

        <Handle
          type='target'
          position={Position.Top}
          style={{ background: isTeacher ? '#F1D1C3' : 'transparent', border: isTeacher ? 1 : 0 }}
        />

        {selected && isTeacher && (
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
                <Tooltip title='Add new Section'>
                  <IconButton
                    onClick={openAddSection}
                    sx={{
                      border: 1,
                      ':hover': {
                        color: 'primary.main',
                      },
                      borderRadius: '50%',
                    }}
                  >
                    <LibraryAddOutlined />
                  </IconButton>
                </Tooltip>
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
                    // onClick={handleAddQuiz}
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
            </Box>
          </Box>
        )}
        {/* <ResourceActions status='create' isOpen={isOpenResource} onClose={closeResource} moduleId={id} />
   <LectureActions status='create' isOpen={isOpenLecture} onClose={closeLecture} moduleId={id} />
   <AssignmentActions status='create' isOpen={isOpenAssignment} onClose={closeAssignment} moduleId={id} />  */}
        <ResourceActions
          status='create'
          isOpen={isOpenResource}
          onClose={closeResource}
          onCreate={mutateCreateResource}
        />
        <AssignmentActions
          status='create'
          isOpen={isOpenAssignment}
          onClose={closeAssignment}
          onCreate={mutateCreateAssignment}
        />
        <LectureActions isOpen={isOpenLecture} onClose={closeLecture} onCreate={mutateCreateLecture} />

        {/* {selected && isTeacher && (
          <IconButton
            onClick={openDrawer}
            sx={{
              position: 'absolute',
              zIndex: 10,
              top: -10,
              right: -10,
              bgcolor: 'white',
              border: '1px solid #ccc',
              ':hover': { bgcolor: 'white' },
            }}
            size='small'
          >
            <MoreHorizOutlined fontSize='small' />
          </IconButton>
        )} */}

        <ModalSection
          status='create'
          isOpen={isOpenAddSection}
          onClose={closeAddSection}
          onSubmit={handleCreateSection}
        />
      </Box>
      {isTeacher && <DrawerNodeDetail isOpen={isOpenDrawer && selected} onClose={closeDrawer} unit={unit} />}
    </>
  )
}
