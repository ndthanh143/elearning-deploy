import { Box, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Node, Edge, MarkerType } from 'reactflow'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

import 'reactflow/dist/style.css'
import { CustomEdge } from './CustomEdge'
import { ChildEdge } from './ChildEdge'
import { CustomNodeComponent } from './CustomNodeComponent'
import { ChildNodeComponent } from './ChildNodeComponent'
import { ProfileSetting } from './components/actions'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { CustomTooltip } from '..'
import { primary } from '@/styles/theme'

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
  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [fullscreen, setFullscreen] = useState(false)

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
        // ...(isDefaultUnit && {
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: isDefaultUnit ? primary[500] : '#7EB6C0',
        },
        // }),
      })
    }

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [units])

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  return (
    <Box display='flex' flexDirection='column' position='relative' borderRadius={3} overflow='hidden'>
      <CustomTooltip title={fullscreen ? 'Exist full screen' : 'View full screen'}>
        <IconButton
          onClick={toggleFullscreen}
          sx={{ position: fullscreen ? 'fixed' : 'absolute', top: 16, left: 16, zIndex: 10000 }}
        >
          {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </CustomTooltip>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          position: fullscreen ? 'fixed' : 'relative',
          transition: 'all ease-in-out 0.3s',
          top: 0,
          left: 0,
          background: '#FFFDF5',
          zIndex: fullscreen ? 1000 : 'auto',
        }}
      >
        <ProfileSetting lessonPlanId={lessonPlan.id} />

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
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          panOnScroll={true}
          onlyRenderVisibleElements={false}
          zoomOnDoubleClick={false}
          zoomOnScroll={false}
          preventScrolling={false}
        ></Box>
      </Box>
    </Box>
  )
}
