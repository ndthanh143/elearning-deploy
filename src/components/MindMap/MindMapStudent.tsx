import { useAuth, useBoolean } from '@/hooks'
import { Box, Button, Divider, IconButton, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  getOutgoers,
  getConnectedEdges,
  Node,
  Edge,
  updateEdge,
  Connection,
  useReactFlow,
  MarkerType,
  MiniMap,
} from 'reactflow'

import 'reactflow/dist/style.css'
import { Module } from '@/services/module/module.dto'
import { CustomEdge } from './CustomEdge'
import { ChildEdge } from './ChildEdge'
import { CustomNodeComponent } from './CustomNodeComponent'
import { ChildNodeComponent } from './ChildNodeComponent'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { moduleService } from '@/services/module/module.service'
import { moduleKey } from '@/services/module/module.query'
import { ModalSection, SectionModalProps } from '@/pages/PlanningPage/modals'
import { toast } from 'react-toastify'
import { AddCircleOutlineOutlined, ChevronLeftOutlined, MoreHorizOutlined, MoreOutlined } from '@mui/icons-material'
import { blue, green, grey, purple } from '@mui/material/colors'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { useNavigate } from 'react-router-dom'
import { ActionSetting } from './components'
import { ProfileSetting } from './components/actions'
import { unitKey } from '@/services/unit/query'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'

const nodeTypes = {
  customNode: CustomNodeComponent, // Define your custom node type
  childNode: ChildNodeComponent, // Define your custom node type
}

const edgeTypes = {
  customEdge: CustomEdge,
  childEdge: ChildEdge,
}

type NodeType = {
  id: string
  position: { x: number; y: number }
  data: {
    parent?: NodeType
    sibling?: NodeType
    type: string
    icon: string
    label: string
    isDone?: boolean
    isDisabled?: boolean
    id?: number
    lessonPlanId?: number
  }
  type: string
  sourcePosition?: string
  selected?: boolean
}

// const initialEdges: Edge[] = [
//   { id: 'e1-2', source: '1', target: '2', type: 'customEdge', sourceHandler: 'c' },
//   { id: 'e2-3', source: '2', target: '3', type: 'customEdge', sourceHandler: 'c' },
//   { id: 'e3-4', source: '3', target: '4', type: 'customEdge', sourceHandler: 'c' },
//   { id: 'e4-5', source: '4', target: '5', type: 'customEdge' },
//   { id: 'e5-6', source: '5', target: '6', type: 'customEdge' },
//   { id: 'e6-7', source: '6', target: '7', type: 'customEdge' },
//   { id: 'e1-8', source: '1', target: '8', type: 'childEdge' },
//   { id: 'e1-9', source: '1', target: '9', type: 'childEdge' },
//   { id: 'e1-10', source: '1', target: '10', type: 'childEdge' },
// ]

interface IMindMapProps {
  lessonPlan: LessonPlan
}

export function MindMapStudent({ lessonPlan }: IMindMapProps) {
  const { profile } = useAuth()

  const parentIds: string[] = []

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const units = lessonPlan.units

  console.log('units', units)

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

  const [hidden, setHidden] = useState(false)

  const hide = (hidden: boolean, childEdgeID: number[], childNodeID: number[]) => (nodeOrEdge: any) => {
    if (childEdgeID.includes(nodeOrEdge.id) || childNodeID.includes(nodeOrEdge.id)) nodeOrEdge.hidden = hidden
    return nodeOrEdge
  }

  const checkTarget = (edges: Edge[], id: string) => {
    return edges.filter((ed) => {
      return ed.target !== id
    })
  }

  let outgoers: any[] = []
  let connectedEdges: any[] = []
  let stack: any[] = []

  const scrollContainerRef = useRef(null)

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [],
  )

  const onConnect = useCallback(
    (connections: Connection) =>
      setEdges((els) => {
        return addEdge({ ...connections, type: 'customEdge' }, els)
      }),
    [],
  )
  const { fitView } = useReactFlow()

  // const [focusId, setFocusId] = useState<string | null>('e7051179867373568')

  // useEffect(() => {
  //   fitView({
  //     nodes: [{ id: '7051334068535296' }],
  //     duration: 500,
  //     minZoom: 1,
  //     maxZoom: 1,
  //   })
  // }, [])

  return (
    <Box display='flex' flexDirection='column' position='relative'>
      {/* <ActionSetting /> */}
      <ProfileSetting />
      {/* <Divider /> */}

      {/* <Box width={20}>
        {initialNodes.map((item) => (
          <Button
            onClick={() =>
              fitView({
                nodes: [{ id: item.id }],
                duration: 500,
              })
            }
          >
            {item.id}
          </Button>
        ))}
      </Box> */}
      <Box
        style={{
          width: '100%',
          height: '100vh',
          //   background: 'linear-gradient(135deg, #007BFF 0%, #FFA500 100%)',
        }}
        ref={scrollContainerRef}
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
          onConnect={onConnect}
          // fitView
          onEdgeUpdate={onEdgeUpdate}
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
