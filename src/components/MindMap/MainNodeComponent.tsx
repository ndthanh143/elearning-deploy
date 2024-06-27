import { Unit } from '@/services/unit/types'
import { Box, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { Handle, NodeProps, Position } from 'reactflow'
import { MutableRefObject } from 'react'
import { primary } from '@/styles/theme'
import { icons } from '@/assets/icons'

export const MainNodeComponent = (
  props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement>; index: number }>,
) => {
  const {
    data: { parentRef, index, ...unit },
  } = props

  return (
    <>
      <Stack
        sx={{
          backgroundColor: primary[500],
          color: '#fff',
          borderRadius: '100%',
          width: 200,
          minHeight: 50,
          fontSize: 12,
          px: 4,
          py: 3,
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.2s ease-in-out',
          ':hover': {
            borderColor: blue[500],
          },
          zIndex: 10,
          border: `4px solid ${primary[500]}`,
        }}
      >
        <Box width={50} height={50} bgcolor='#fff' p={1} borderRadius='100%'>
          {icons['planMindmap']}
        </Box>
        <Typography textAlign={'center'} fontWeight={700}>
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
      </Stack>
    </>
  )
}
