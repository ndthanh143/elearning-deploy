import { Unit } from '@/services/unit/types'
import { Box, Typography } from '@mui/material'
import { blue, green } from '@mui/material/colors'
import { Handle, NodeProps, Position } from 'reactflow'
import { MutableRefObject } from 'react'
import { primary } from '@/styles/theme'
import { Flex } from '..'
import { icons } from '@/assets/icons'

type StatusNodeType = 'lock' | 'done' | 'current'

export const CourseCustomNodeComponent = (props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement> }>) => {
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
          <Flex gap={0.5} bgcolor={primary[100]} py={0.2} px={1} borderRadius={4}>
            {icons['lecture']}
            <Typography variant='caption'>{1}</Typography>
          </Flex>
          <Flex gap={0.5} bgcolor={primary[100]} py={0.2} px={1} borderRadius={4}>
            {icons['assignment']}
            {0 > 0 && <Typography variant='caption'>{0}</Typography>}
          </Flex>
          <Flex gap={0.5} bgcolor={primary[100]} py={0.2} px={1} borderRadius={4}>
            {icons['quiz']}
            {0 > 0 && <Typography variant='caption'>{0}</Typography>}
          </Flex>
          <Flex gap={0.5} bgcolor={primary[100]} py={0.2} px={1} borderRadius={4}>
            <Box width={20} height={20}>
              {icons['video']}
            </Box>
            {0 > 0 && <Typography variant='caption'>{0}</Typography>}
          </Flex>
          <Flex gap={0.5} bgcolor={primary[100]} py={0.2} px={1} borderRadius={4}>
            <Box width={20} height={20}>
              {icons['resource']}
            </Box>
            {0 > 0 && <Typography variant='caption'>{0}</Typography>}
          </Flex>
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
