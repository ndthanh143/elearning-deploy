import { useAuth, useBoolean, useMenu } from '@/hooks'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { Position, NodeProps, Handle, useReactFlow } from 'reactflow'
import actions from '@/assets/images/icons/actions'

import 'reactflow/dist/style.css'
import { blue, gray } from '@/styles/theme'
import { green } from '@mui/material/colors'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArticleOutlined,
  AssignmentOutlined,
  CategoryOutlined,
  CheckCircleOutline,
  DeleteOutline,
  EditOutlined,
  FileUploadOutlined,
  LockOutlined,
  MoreHorizOutlined,
  QuizOutlined,
} from '@mui/icons-material'
import { PropsWithChildren, useEffect, useRef, useState } from 'react'

const isTeacher = false

type NodeDataType = 'lecture' | 'assignment' | 'quiz' | 'resource'

type StatusNodeType = 'lock' | 'done' | 'current'

import { keyframes } from '@mui/system'
import { Unit } from '@/services/unit/types'
import { DrawerChildNodeDetail } from './components'
import { LectureActions } from '@/pages/PlanningPage/modals'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lectureService } from '@/services/lecture/lecture.service'
import { toast } from 'react-toastify'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { TeacherChildNodeComponent } from './TeacherChildNodeComponent'
import { StudentChildNodeComponent } from './StudentChildNodeComponent'

const pingBorder = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1, 1.5);
    opacity: 0;
  }
`

const AnimatedBox = ({ children, isPing = false }: PropsWithChildren<{ isPing?: boolean }>) => {
  return (
    <Box
      sx={{
        position: 'relative',
        transition: 'all ease 1s',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -1, // aligning the pseudo-element with the Box border
          left: -1,
          right: -1,
          bottom: -1,
          borderRadius: 6, // the border-radius of the Box
          border: `4px solid ${isPing ? blue[500] : 'transparent'}`,
          animation: isPing ? `${pingBorder} 1s infinite` : 'none',
        },
      }}
    >
      {children}
    </Box>
  )
}

const icons: Record<'assignment' | 'lecture' | 'quiz' | 'resource', string> = {
  assignment: actions.assignment,
  lecture: actions.lecture,
  quiz: actions.quiz,
  resource: actions.resource,
}

export const ChildNodeComponent = (props: NodeProps<Unit>) => {
  const { profile } = useAuth()
  const isTeacher = profile?.data.roleInfo.name === 'Teacher'

  if (isTeacher) {
    return <TeacherChildNodeComponent {...props} />
  } else {
    return <StudentChildNodeComponent {...props} />
  }

  const { data: unit, xPos, selected } = props
  const { parent } = unit

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const parentRef = useRef<HTMLDivElement | null>(null)

  const [modePopup, setModePopup] = useState<'actions' | 'more'>('actions')
  const { value: isOpen, toggle, setFalse: closeModal } = useBoolean()
  const { fitView } = useReactFlow()
  const { anchorEl: anchorElMenu, isOpen: isOpenMenu, onClose: closeMenu, onOpen: openMenu } = useMenu(parentRef)
  const { value: isOpenDrawer, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean()
  const { value: isOpenLecture, setFalse: closeLecture, setTrue: openLecture } = useBoolean()
  const { value: isOpenAssignment, setFalse: closeAssignment, setTrue: openAssignment } = useBoolean()
  // const { value: isOpenDrawer, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean()

  const { mutate: mutateUpdateUnit } = useMutation({
    mutationFn: unitService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
    },
  })

  const { mutate: mutateUpdateLecture } = useMutation({
    mutationFn: lectureService.update,
    onSuccess: (lecture) => {
      toast.success('Update lecture successfully!')
      mutateUpdateUnit({ id: unit.id, name: lecture.lectureName })
      closeLecture()
    },
  })

  if (!unit) {
    return null
  }
  const targetPosition = xPos < (parent?.position?.x || 0) ? Position.Right : Position.Left
  const sourcePosition = xPos < (parent?.position?.x || 0) ? Position.Left : Position.Right

  const dataTypes = {
    lecture: {
      name: unit.lectureInfo?.lectureName,
      navigate: () => navigate(`${pathname}/lecture/${unit.lectureInfo?.id}`),
    },
    assignment: {
      name: unit.assignmentInfo?.assignmentTitle,
      navigate: () => navigate(`${pathname}/assign/${unit.assignmentInfo?.id}`),
    },
    quiz: {
      name: unit.quizInfo?.quizTitle,
      navigate: () => navigate(`${pathname}/quiz/${unit.quizInfo?.id}`),
    },
    resource: {
      name: unit.resourceInfo?.title,
      navigate: () => navigate(`${pathname}/resource/${unit.resourceInfo?.id}`),
    },
  }

  const type = unit.lectureInfo ? 'lecture' : unit.assignmentInfo ? 'assignment' : unit.quizInfo ? 'quiz' : 'resource'

  const generateModeContent = {
    actions: (
      <Grid container p={2} spacing={2} width='100%'>
        <Grid item xs={4}>
          <Button
            variant='outlined'
            // onClick={openLecture}
            sx={{
              display: 'flex',
              flexDirection: 'column',

              fontSize: 12,
            }}
            color='secondary'
          >
            <ArticleOutlined />
            Lecture
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant='outlined'
            // onClick={openLecture}
            sx={{
              display: 'flex',
              flexDirection: 'column',

              fontSize: 12,
            }}
            color='secondary'
          >
            <FileUploadOutlined />
            Upload
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant='outlined'
            // onClick={openLecture}
            sx={{
              display: 'flex',
              flexDirection: 'column',

              fontSize: 12,
            }}
            color='secondary'
          >
            <QuizOutlined />
            Quiz
          </Button>
        </Grid>

        <Grid item xs={4}>
          <Button
            variant='outlined'
            // onClick={openLecture}
            sx={{
              display: 'flex',
              flexDirection: 'column',

              fontSize: 12,
            }}
            color='secondary'
          >
            <AssignmentOutlined />
            Assignment
          </Button>
        </Grid>
      </Grid>
    ),
    more: (
      <MenuList>
        <MenuItem sx={{ width: '100%', borderRadius: 2 }} color='primary.main'>
          <ListItemText>Update</ListItemText>
          <ListItemIcon>
            <EditOutlined fontSize='small' />
          </ListItemIcon>
        </MenuItem>
        <MenuItem sx={{ width: '100%', borderRadius: 2 }}>
          <ListItemText>Delete</ListItemText>
          <ListItemIcon>
            <DeleteOutline fontSize='small' />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ width: '100%', borderRadius: 2 }}>
          <ListItemText>Copy link</ListItemText>
        </MenuItem>
      </MenuList>
    ),
  }

  const handleSetMode = (mode: 'actions' | 'more') => () => {
    setModePopup(mode)
  }

  const contentMenu = () => {
    if (isTeacher) {
      return (
        <>
          <Stack direction='row' gap={6} justifyContent='space-between' py={1} px={2} minWidth={300}>
            <Box display='flex' gap={1}>
              <Tooltip title='Actions'>
                <IconButton onClick={handleSetMode('actions')}>
                  <CategoryOutlined />
                </IconButton>
              </Tooltip>
            </Box>
            <Tooltip title='More'>
              <IconButton onClick={handleSetMode('more')}>
                <MoreHorizOutlined color='primary' />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider />
          {generateModeContent[modePopup]}
        </>
      )
    } else {
      return (
        <Stack py={2} px={2} gap={2} minWidth={200}>
          <Stack gap={1}>
            <Typography variant='body2' fontWeight={700}>
              {unit.name}
            </Typography>
            {(status === 'current' || status === 'lock') && (
              <Typography variant='caption' color={gray[500]}>
                2 mins study
              </Typography>
            )}
            {status === 'done' && (
              <>
                <Typography variant='caption' color={gray[500]}>
                  Đã hoàn thành
                </Typography>
                <Typography variant='caption' color={gray[500]}>
                  Số điểm đạt được: <b>100/100</b>
                </Typography>
              </>
            )}
            {status == 'lock' && (
              <Typography variant='caption' fontWeight={400}>
                Bạn phải hoàn thành bài học{' '}
                {unit.prerequisites.map((prerequitsite) => (
                  <b>{prerequitsite.name}</b>
                ))}{' '}
                trước khi tiếp tục
              </Typography>
            )}
          </Stack>
          <Button
            fullWidth
            variant={'contained'}
            onClick={dataTypes[type as NodeDataType].navigate}
            disabled={status === 'lock'}
          >
            {nodeStatusProperties[status].popup.buttonLabel}
          </Button>
        </Stack>
      )
    }
  }

  const nodeStatusProperties: Record<StatusNodeType, any> = {
    lock: {
      backgroundColor: gray[200],
      textColor: '#000',
      borderColor: '#ccc',
      popup: {
        buttonLabel: 'Locked',
      },
    },
    done: {
      backgroundColor: green[500],
      textColor: '#fff',
      borderColor: green[600],
      popup: {
        buttonLabel: 'Review',
      },
    },
    current: {
      backgroundColor: blue[500],
      textColor: '#fff',
      borderColor: blue[600],
      popup: {
        buttonLabel: 'Ready',
      },
    },
  }

  let status: StatusNodeType = 'current'
  if (!isTeacher) {
    if (!unit.unlock) {
      status = 'lock'
    }

    if (type === 'lecture') {
    }

    if (unit.assignmentInfo?.assignmentSubmissionInfo) {
      status = 'done'
    }
  } else {
  }

  useEffect(() => {
    if (status === 'current') {
      setTimeout(() => {
        fitView({
          nodes: [{ id: unit.id.toString() }],
          duration: 500,
          minZoom: 1,
          maxZoom: 1,
        })
      }, 100) // Delay fitView to ensure all elements are loaded
    }
  }, [status, fitView, unit.id])

  return (
    <>
      <Box
        border={4}
        borderRadius={6}
        borderColor={selected ? blue[500] : 'transparent'}
        padding={0.5}
        position='relative'
        ref={parentRef}
        sx={{
          transition: 'all ease 0.2s',
        }}
        onClick={(e) => {
          !isTeacher && openMenu(e)
          if (isTeacher) {
            openDrawer()
          } else {
            openMenu(e)
          }
        }}
        // overflow='hidden'
      >
        <AnimatedBox isPing={status === 'current' && !selected && !isTeacher}>
          <Box
            p={2}
            border={1}
            // borderRadius='100%'
            borderRadius={4}
            borderColor={nodeStatusProperties[status].borderColor}
            onClick={toggle}
            position='relative'
            sx={{
              backgroundColor: nodeStatusProperties[status].backgroundColor,
              color: nodeStatusProperties[status].textColor,

              transition: 'all 0.2s ease-in-out',
              // ':hover': {
              //   borderRadius: 4,
              //   '.lecture-name': { width: '100%' },
              // },
            }}
          >
            <Box display='flex' gap={2} alignItems='center'>
              <Box
                component='img'
                src={icons[type as NodeDataType]}
                alt='icon'
                width={40}
                height={40}
                borderRadius='100%'
              />
              <Typography variant='body2' textAlign={'center'}>
                {unit.name}
              </Typography>
              {status === 'lock' && <LockOutlined />}
              {status == 'done' && <CheckCircleOutline />}
            </Box>
            <Handle
              type='source'
              position={sourcePosition}
              style={{
                backgroundColor: isTeacher ? '#000' : 'transparent',
                borderColor: 'transparent',
                width: 0,
                height: 0,
                padding: 0,
                visibility: 'hidden',
              }}
            />

            <Handle
              type='target'
              position={targetPosition}
              style={{
                backgroundColor: isTeacher ? '#000' : 'transparent',
                borderColor: 'transparent',
                width: 0,
                height: 0,
                padding: 0,
                visibility: 'hidden',
              }}
            />

            {/* {isOpen && (
          <CustomModal isOpen={isOpen} onClose={closeModal} title='Hello'>
            <Box bgcolor='white' width={500} height={500} m={'auto'}>
              <Typography>Hello</Typography>
            </Box>
          </CustomModal>
        )} */}
          </Box>
        </AnimatedBox>
      </Box>
      <Popover
        open={isOpenMenu}
        anchorEl={anchorElMenu}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            style: {
              boxShadow: 'none',
              border: '1px solid #ccc',
              maxWidth: 300,
              borderRadius: '16px', // Adjust this value to control the border radius
            },
          },
        }}
      >
        {contentMenu()}
      </Popover>
      {isTeacher && (
        <DrawerChildNodeDetail
          isOpen={isOpenDrawer && selected}
          onClose={closeDrawer}
          unit={unit}
          type={type}
          onEdit={() => {
            if (type === 'lecture') {
              openLecture()
            }
          }}
        />
      )}

      {unit.lectureInfo && (
        <LectureActions
          defaultData={unit.lectureInfo}
          isOpen={isOpenLecture}
          onClose={closeLecture}
          onUpdate={mutateUpdateLecture}
        />
      )}
    </>
  )
}
