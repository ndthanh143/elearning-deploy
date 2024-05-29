import { Box } from '@mui/material'
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow'

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <Box component={BaseEdge} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#F79B8D', strokeWidth: 4 }} />
    </>
  )
}
