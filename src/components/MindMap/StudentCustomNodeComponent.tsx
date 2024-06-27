import { Unit } from '@/services/unit/types'
import { Box, Typography } from '@mui/material'
import { blue, green } from '@mui/material/colors'
import { Handle, NodeProps, Position } from 'reactflow'
import { MutableRefObject } from 'react'
import { primary } from '@/styles/theme'
import { Flex } from '..'
import { icons } from '@/assets/icons'

type StatusNodeType = 'lock' | 'done' | 'current'

const calculateChildrenItems = (children: Unit[]) => {
  let lecture = 0
  let assignment = 0
  let quiz = 0
  let video = 0
  let resource = 0

  for (const child of children) {
    if (child.lectureInfo) {
      lecture++
    }
    if (child.assignmentInfo) {
      assignment++
    }
    if (child.quizInfo) {
      quiz++
    }

    if (child.resourceInfo) {
      if (child.resourceInfo?.urlDocument.includes('VIDEO')) {
        video++
      } else {
        resource++
      }
    }
  }

  return { lecture, assignment, quiz, video, resource }
}

export const CourseCustomNodeComponent = (
  props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement>; childrens: Unit[] }>,
) => {
  const {
    data: { parentRef, ...unit },
    selected,
  } = props

  const nodeStatusProperties: Record<StatusNodeType, any> = {
    lock: {
      backgroundColor: '#F79B8D',
    },
    done: {
      backgroundColor: green[500],
    },
    current: {
      backgroundColor: primary[500],
    },
  }

  let statusNodes: StatusNodeType = 'current'
  if (!unit.unlock) {
    statusNodes = 'lock'
  }

  const dataChildrens = calculateChildrenItems((unit.childrens || []) as Unit[])

  const dataChildrenProps = [
    { icon: icons['lecture'], name: 'lecture', value: dataChildrens.lecture },
    { icon: icons['assignment'], name: 'assignment', value: dataChildrens.assignment },
    { icon: icons['quiz'], name: 'quiz', value: dataChildrens.quiz },
    { icon: icons['video'], name: 'video', value: dataChildrens.video },
    { icon: icons['resource'], name: 'resource', value: dataChildrens.resource },
  ]

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: 4,
          minWidth: 200,
          maxWidth: 400,
          border: '1px solid',
          borderColor: selected ? blue[500] : nodeStatusProperties[statusNodes].backgroundColor,
          minHeight: 50,
          fontSize: 12,
          px: 4,
          py: 1,
          gap: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.2s ease-in-out',
          zIndex: 10,
          filter: selected ? `drop-shadow(0 0 0.75rem ${primary[500]})` : 'none',
          ':hover': {
            borderColor: blue[500],
          },
        }}
      >
        <Typography variant='body2' textAlign={'left'}>
          {unit.name}
        </Typography>

        <Flex gap={0.5} maxWidth={100} flexWrap='wrap'>
          {dataChildrenProps.map(
            (item) =>
              item.value > 0 && (
                <Flex gap={0.5} bgcolor={primary[100]} py={0.2} px={1} borderRadius={4}>
                  <Box width={20} height={20}>
                    {item.icon}
                  </Box>
                  {item.value > 1 && <Typography variant='caption'>{item.value}</Typography>}{' '}
                </Flex>
              ),
          )}
        </Flex>

        <Handle
          type='source'
          position={Position.Bottom}
          style={{
            background: 'transparent',
            border: 0,
            position: 'absolute',
            zIndex: 1,
          }}
        />

        <Handle type='target' position={Position.Top} style={{ background: 'transparent', border: 0 }} />
      </Box>
    </>
  )
}
