import { useBoolean, useMenu } from '@/hooks'
import { Box, Button, Popover, Stack, Typography } from '@mui/material'
import { Position, NodeProps, Handle } from 'reactflow'
import actions from '@/assets/images/icons/actions'

import 'reactflow/dist/style.css'
import { blue, gray } from '@/styles/theme'
import { green } from '@mui/material/colors'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircleRounded, LockRounded } from '@mui/icons-material'
import { PropsWithChildren, useRef } from 'react'

type StatusNodeType = 'lock' | 'done' | 'current'

import { keyframes } from '@mui/system'
import { Unit, UnitType } from '@/services/unit/types'
import { getTypeUnit } from '@/utils'
import { Flex } from '..'

const pingBorder = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
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
          borderRadius: '100%', // the border-radius of the Box
          border: `2px solid ${isPing ? blue[500] : 'transparent'}`,
          animation: isPing ? `${pingBorder} 1s infinite` : 'none',
        },
      }}
    >
      {children}
    </Box>
  )
}

const icons: Record<UnitType, string> = {
  assignment: actions.assignment,
  lecture: actions.lecture,
  quiz: actions.quiz,
  resource: actions.resource,
  video: actions.video,
}

export const CourseChildNodeComponent = (props: NodeProps<Unit & { hidden: boolean }>) => {
  const { data: unit, xPos, selected } = props
  const { parent, hidden } = unit

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const parentRef = useRef<HTMLDivElement | null>(null)

  const { toggle } = useBoolean()
  const { anchorEl: anchorElMenu, isOpen: isOpenMenu, onClose: closeMenu, onOpen: openMenu } = useMenu(parentRef)

  if (!unit) {
    return null
  }
  const targetPosition = xPos < (parent?.position?.x || 0) ? Position.Right : Position.Left
  const sourcePosition = xPos < (parent?.position?.x || 0) ? Position.Left : Position.Right

  const dataTypes = {
    lecture: {
      name: unit.lectureInfo?.lectureName,
      navigate: () => navigate(`${pathname}/u/${unit.id}/lecture/${unit.lectureInfo?.id}`),
    },
    assignment: {
      name: unit.assignmentInfo?.assignmentTitle,
      navigate: () => navigate(`${pathname}/u/${unit.id}/assign/${unit.assignmentInfo?.id}`),
    },
    quiz: {
      name: unit.quizInfo?.quizTitle,
      navigate: () => navigate(`${pathname}/u/${unit.id}/quiz/${unit.quizInfo?.id}`),
    },
    resource: {
      name: unit.resourceInfo?.title,
      navigate: () => navigate(`${pathname}/u/${unit.id}/resource/${unit.resourceInfo?.id}`),
    },
    video: {
      name: unit.resourceInfo?.title,
      navigate: () => navigate(`${pathname}/u/${unit.id}/resource/${unit.resourceInfo?.id}`),
    },
  }
  const type = getTypeUnit(unit)

  const contentMenu = () => (
    <Stack py={2} px={2} gap={2} minWidth={200}>
      <Stack gap={1}>
        <Typography variant='body2' fontWeight={700}>
          {unit.name}
        </Typography>
        <Typography
          variant='body2'
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden', lineClamp: 3, whiteSpace: 'nowrap', maxWidth: '100%' }}
        >
          {unit.description}
        </Typography>
        {(status === 'current' || status === 'lock') && (
          <Typography variant='caption' color={gray[500]}>
            {unit.resourceInfo?.duration}
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
        onClick={dataTypes[type as UnitType].navigate}
        disabled={status === 'lock'}
      >
        {nodeStatusProperties[status].popup.buttonLabel}
      </Button>
    </Stack>
  )

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
      backgroundColor: '#fff',
      textColor: '#000',
      borderColor: green[600],
      popup: {
        buttonLabel: 'Review',
      },
    },
    current: {
      backgroundColor: '#fff',
      textColor: '#000',
      borderColor: blue[600],
      popup: {
        buttonLabel: 'Ready',
      },
    },
  }

  let status: StatusNodeType = 'current'
  if (!unit.unlock) {
    status = 'lock'
  }

  if (type === 'lecture') {
  }

  if (unit.isDone) {
    status = 'done'
  }

  // useEffect(() => {
  //   if (status === 'current') {
  //     setTimeout(() => {
  //       fitView({
  //         nodes: [{ id: unit.id.toString() }],
  //         duration: 500,
  //         minZoom: 1,
  //         maxZoom: 1,
  //       })
  //     }, 100) // Delay fitView to ensure all elements are loaded
  //   }
  // }, [status, fitView, unit.id])

  return (
    <>
      <Box
        borderRadius={6}
        padding={0.5}
        position='relative'
        ref={parentRef}
        sx={{
          transition: 'all ease 0.2s',
          filter: selected ? `drop-shadow(0px 0px 0.25rem ${status === 'done' ? green[500] : blue[500]})` : 'none',
          opacity: hidden ? 0 : 1,
          mt: hidden ? 2 : 0,
        }}
        onClick={(e) => {
          openMenu(e)
        }}
      >
        <Box
          p={2}
          borderRadius={4}
          onClick={toggle}
          position='relative'
          sx={{
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <AnimatedBox isPing={status === 'current' && !selected}>
            <Stack
              gap={2}
              alignItems='center'
              position='relative'
              sx={{
                ':hover': {
                  '.status-node': {
                    opacity: 1,
                    top: -30,
                  },
                  '.icon-node-status': {
                    opacity: 0,
                  },
                  '.icon-node-img': {
                    opacity: 1,
                  },
                },
              }}
            >
              {['done', 'lock'].includes(status) && (
                <Flex
                  className='status-node'
                  // bgcolor={nodeStatusProperties[status].borderColor}
                  borderRadius={'100%'}
                  position='absolute'
                  zIndex={1}
                  borderColor={gray[500]}
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    left: '50%',
                    top: -20,
                    opacity: 0,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {status === 'lock' && <LockRounded sx={{ color: '#333' }} />}
                  {status == 'done' && <CheckCircleRounded sx={{ color: green[500] }} />}
                </Flex>
              )}
              <Flex
                justifyContent='center'
                width={65}
                height={65}
                borderRadius={'100%'}
                border={2}
                borderColor={nodeStatusProperties[status].borderColor}
              >
                {status === 'done' && (
                  <CheckCircleRounded
                    className='icon-node-status'
                    sx={{
                      color: green[500],
                      opacity: 1,
                      transition: 'all 0.2s ease-in-out',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-50%)',
                    }}
                    fontSize='large'
                  />
                )}
                {status === 'lock' && (
                  <LockRounded
                    className='icon-node-status'
                    sx={{
                      color: '#333',
                      opacity: 1,
                      transition: 'all 0.2s ease-in-out',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-50%)',
                    }}
                    fontSize='large'
                  />
                )}
                <Box
                  component='img'
                  src={icons[type as UnitType]}
                  alt='icon'
                  width={45}
                  height={45}
                  sx={{
                    opacity: ['done', 'lock'].includes(status) ? 0 : 1,
                    transition: 'all 0.2s ease-in-out',
                  }}
                  className='icon-node-img'
                />
              </Flex>

              <Stack position='absolute' top='110%' minWidth={200}>
                <Typography variant='body2' textAlign={'center'} fontWeight={700}>
                  {unit.name}
                </Typography>
                <Typography variant='body2' textAlign={'center'} color={gray[500]}>
                  {unit.description}
                </Typography>
              </Stack>
            </Stack>
          </AnimatedBox>

          <Handle
            type='source'
            position={sourcePosition}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              width: 0,
              height: 0,
              padding: 0,
              visibility: 'hidden',
            }}
          />

          {!hidden && (
            <Handle
              type='target'
              position={targetPosition}
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                width: 0,
                height: 0,
                padding: 0,
                visibility: 'hidden',
              }}
            />
          )}
        </Box>
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
    </>
  )
}
