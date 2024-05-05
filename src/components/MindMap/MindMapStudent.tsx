import { Box } from '@mui/material'
import { useEffect } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Node, Edge, MarkerType } from 'reactflow'

import 'reactflow/dist/style.css'
import { CustomEdge } from './CustomEdge'
import { ChildEdge } from './ChildEdge'
import { CustomNodeComponent } from './CustomNodeComponent'
import { ChildNodeComponent } from './ChildNodeComponent'
import { ProfileSetting } from './components/actions'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'

const nodeTypes = {
  customNode: CustomNodeComponent, // Define your custom node type
  childNode: ChildNodeComponent, // Define your custom node type
}

const edgeTypes = {
  customEdge: CustomEdge,
  childEdge: ChildEdge,
}

interface IMindMapProps {
  lessonPlan: LessonPlan
}

export function MindMapStudent({ lessonPlan }: IMindMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const units = lessonPlan.units

  useEffect(() => {
    const initialEdges: Edge[] = []

    const initialNodes: Node<any, string | undefined>[] = []

    for (const item of units || []) {
      const isDefaultUnit = !Boolean(item.lectureInfo || item.assignmentInfo || item.quizInfo || item.resourceInfo)
      const currentNodeId = item.id.toString()
      const parentNodeId = item.parent?.id.toString()

      initialNodes.push({
        id: currentNodeId,
        position: item.position || { x: 0, y: 0 },
        data: item,
        type: isDefaultUnit ? 'customNode' : 'childNode',
      })
      initialEdges.push({
        id: `e${parentNodeId}-${currentNodeId}`,
        source: parentNodeId || '',
        target: currentNodeId,
        type: isDefaultUnit ? 'customEdge' : 'childEdge',
        ...(isDefaultUnit && {
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: '#F79B8D',
          },
        }),
      })
    }

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [units])

  return (
    <Box display='flex' flexDirection='column' position='relative'>
      <ProfileSetting lessonPlanId={lessonPlan.id} />

      <Box
        style={{
          width: '100%',
          height: '100vh',
          background: '#FFFDF5',
        }}
      >
        <Box
          sx={{
            'react-flow__zoompane': {
              maxHeight: '100%',
              maxWidth: '100%',
              overflow: 'scroll',
            },
          }}
          component={ReactFlow}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          // fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          panOnScroll={true}
          onlyRenderVisibleElements={false}
          zoomOnDoubleClick={false}
          zoomOnScroll={false}
          preventScrolling={false}
          // zoomOnPinch={false}
        ></Box>
      </Box>
      {/* <Box sx={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9, pointerEvents: 'none' }} /> */}
    </Box>
  )
}
