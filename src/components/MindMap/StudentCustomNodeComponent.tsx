import { Unit } from '@/services/unit/types'
import { Box, Typography } from '@mui/material'
import { blue, green } from '@mui/material/colors'
import { Handle, NodeProps, Position } from 'reactflow'
import { MutableRefObject } from 'react'
import { primary } from '@/styles/theme'

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
      {/* <Box
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: 4,
          width: 200,
          minHeight: 50,
          fontSize: 12,
          px: 4,
          py: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.2s ease-in-out',
          border: '4px solid',
          borderColor: selected ? blue[500] : nodeStatusProperties[statusNodes].backgroundColor,
          ':hover': {
            borderColor: blue[500],
          },
          zIndex: 10,
          boxShadow: 10,
        }}
      > */}
      <Box
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: 4,
          width: 200,
          border: '1px solid',
          borderColor: selected ? blue[500] : nodeStatusProperties[statusNodes].backgroundColor,
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
