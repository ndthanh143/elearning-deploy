import { blue, gray } from '@/styles/theme'
import { Box } from '@mui/material'
import { orange, red } from '@mui/material/colors'
import { BaseEdge, EdgeLabelRenderer, EdgeProps, MarkerType, getBezierPath, useReactFlow } from 'reactflow'

// const onEdgeClick = (evt, id) => {
//   evt.stopPropagation()
//   alert(`remove ${id}`)
// }

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // const onEdgeClick = () => {
  //   setEdges((edges) => edges.filter((edge) => edge.id !== id))
  // }

  return (
    <>
      <Box component={BaseEdge} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#F79B8D', strokeWidth: 4 }} />

      {/* <EdgeLabelRenderer></EdgeLabelRenderer> */}
    </>
  )
}
