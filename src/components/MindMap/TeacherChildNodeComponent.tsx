import { useAuth, useBoolean } from '@/hooks'
import { Box, Drawer, Stack, Typography } from '@mui/material'
import { Position, NodeProps, Handle } from 'reactflow'
import actions from '@/assets/images/icons/actions'

import { blue, gray } from '@/styles/theme'
import { green } from '@mui/material/colors'
import { useRef } from 'react'

import { Unit, UnitType } from '@/services/unit/types'
import { DrawerChildNodeDetail } from './components'
import { LectureActions } from '@/pages/Teacher/PlanningPage/modals'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lectureService } from '@/services/lecture/lecture.service'
import { toast } from 'react-toastify'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { getTypeUnit } from '@/utils'
import { Flex } from '..'

type StatusNodeType = 'lock' | 'done' | 'current'

const icons: Record<UnitType, string> = {
  assignment: actions.assignment,
  lecture: actions.lecture,
  quiz: actions.quiz,
  resource: actions.resource,
  video: actions.video,
}

export const TeacherChildNodeComponent = (props: NodeProps<Unit>) => {
  const { profile } = useAuth()
  const isTeacher = profile?.data.role === 'Teacher'

  const { data: unit, xPos, selected } = props
  const { parent } = unit

  const queryClient = useQueryClient()
  const parentRef = useRef<HTMLDivElement | null>(null)

  const { toggle } = useBoolean()
  const { value: isOpenDrawer, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean()
  const { value: isOpenLecture, setFalse: closeLecture, setTrue: openLecture } = useBoolean()
  // const { value: isOpenAssignment, setFalse: closeAssignment, setTrue: openAssignment } = useBoolean()
  // const { value: isOpenDrawer, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean()

  const { mutate: mutateUpdateUnit } = useMutation({
    mutationFn: unitService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
    },
  })

  const { mutate: mutateUpdateLecture, isPending: isLoadingLecture } = useMutation({
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

  const type = getTypeUnit(unit)

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
      backgroundColor: '#fff',
      textColor: '#000',
      borderColor: blue[600],
      popup: {
        buttonLabel: 'Ready',
      },
    },
  }

  let status: StatusNodeType = 'current'

  return (
    <>
      <Box
        borderRadius={6}
        padding={0.5}
        // position='relative'
        ref={parentRef}
        sx={{
          transition: 'all ease 0.2s',
          filter: selected ? `drop-shadow(0 0 0.75rem ${blue[500]})` : 'none',
        }}
        onClick={() => {
          if (isTeacher) {
            openDrawer()
          }
        }}
      >
        <Box
          p={2}
          // border={1}
          borderRadius={4}
          // borderColor={nodeStatusProperties[status].borderColor}
          onClick={toggle}
          // position='relative'
          sx={{
            // backgroundColor: nodeStatusProperties[status].backgroundColor,
            color: nodeStatusProperties[status].textColor,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Stack gap={2} alignItems='center' position='relative'>
            <Flex
              borderRadius='100%'
              bgcolor='white'
              width={60}
              height={60}
              justifyContent='center'
              border={1}
              borderColor={gray[200]}
            >
              <Box component='img' src={icons[type as UnitType]} alt='icon' width={40} height={40} />
            </Flex>
            <Stack position='absolute' top='110%' minWidth={200}>
              <Typography variant='body2' textAlign={'center'} fontWeight={500}>
                {unit.name}
              </Typography>
              {/* <Typography variant='body2' textAlign={'center'} color={gray[500]}>
                {unit.description}
              </Typography> */}
            </Stack>
          </Stack>
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
        </Box>
      </Box>

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

      {unit.lectureInfo && (
        <Drawer open={isOpenLecture}>
          <LectureActions
            defaultData={unit.lectureInfo}
            isOpen={Boolean(unit.lectureInfo)}
            onClose={closeLecture}
            onUpdate={mutateUpdateLecture}
            isLoading={isLoadingLecture}
          />
        </Drawer>
      )}
    </>
  )
}
