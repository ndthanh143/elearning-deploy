import { getStraightPath } from 'reactflow'

export function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }: any) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  })

  return (
    <g>
      <path style={connectionLineStyle} fill='none' d={edgePath} />
      <circle cx={toX} cy={toY} fill='black' r={3} stroke='#F1D1C3' strokeWidth={1.5} />
    </g>
  )
}
