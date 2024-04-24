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
  OnNodesChange,
  applyNodeChanges,
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
import { ActionSetting, DrawerNodeDetail } from './components'
import { RightAction } from './components/RightAction'
import { unitKey } from '@/services/unit/query'
import { unitService } from '@/services/unit'
import { Flex, Loading } from '..'

const nodeTypes = {
  customNode: CustomNodeComponent, // Define your custom node type
  childNode: ChildNodeComponent, // Define your custom node type
}

const edgeTypes = {
  customEdge: CustomEdge,
  childEdge: ChildEdge,
}

interface IMindMapProps {
  lessonPlanId: number
}

export function MindMap({ lessonPlanId }: IMindMapProps) {
  let outgoers: any[] = []
  let connectedEdges: any[] = []
  let stack: any[] = []

  const { profile } = useAuth()
  const isTeacher = profile?.data.roleInfo.name === 'Teacher'

  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [hidden, setHidden] = useState(false)
  const scrollContainerRef = useRef(null)

  const unitInstance = unitKey.list({ lessonPlanId, unpaged: true })
  const {
    data: units,
    refetch: refetchUnits,
    isLoading: isLoadingUnits,
    isFetched: isFetchedUnits,
  } = useQuery({ ...unitInstance })
  const { mutate: mutateUpdateUnit, isPending: isLoadingUpdateUnit } = useMutation({ mutationFn: unitService.update })

  const hide = (hidden: boolean, childEdgeID: number[], childNodeID: number[]) => (nodeOrEdge: any) => {
    if (childEdgeID.includes(nodeOrEdge.id) || childNodeID.includes(nodeOrEdge.id)) nodeOrEdge.hidden = hidden
    return nodeOrEdge
  }

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        changes.map((change) => {
          if (change.type === 'position') {
            const currentNodeChange = nds.find((node) => node.id === change.id)

            if (currentNodeChange) {
              mutateUpdateUnit({ id: Number(currentNodeChange.id), position: currentNodeChange.position })
            }
          }
        })

        return applyNodeChanges(changes, nds)
      })
    },
    [setNodes],
  )

  const checkTarget = (edges: Edge[], id: string) => edges.filter((ed) => ed.target !== id)

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [],
  )

  const onConnect = useCallback(
    (connections: Connection) =>
      setEdges((els) => {
        mutateUpdateUnit({ id: Number(connections.target), parentId: Number(connections.source) })
        return addEdge({ ...connections, type: 'customEdge' }, els)
      }),
    [],
  )

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    let currentNodeID = node.id

    // setFocusId(currentNodeID)

    // fitView({
    //   nodes: [{ id: currentNodeID }],
    //   duration: 500,
    // })

    stack.push(node)
    while (stack.length > 0) {
      const lastNOde = stack.pop()
      const childnode = getOutgoers(lastNOde, nodes, edges).filter((node) => node.type === 'childNode')

      const childNodeIds = Object.values(childnode).map((node) => node.id)

      const childedge = checkTarget(getConnectedEdges([lastNOde], edges), currentNodeID).filter((edge: Edge) =>
        childNodeIds.includes(edge.target),
      )

      childnode.map((goer) => {
        stack.push(goer)
        outgoers.push(goer)
      })
      childedge.map((edge: Edge) => {
        connectedEdges.push(edge)
      })
    }

    const childNodeID = outgoers.map((node) => {
      return node.id
    })
    const childEdgeID = connectedEdges.map((edge) => {
      return edge.id
    })

    setNodes((node) => node.map(hide(hidden, childEdgeID, childNodeID)))
    setEdges((edge) => edge.map(hide(hidden, childEdgeID, childNodeID)))
    setHidden(!hidden)
  }, [])

  useEffect(() => {
    const initialEdges: Edge[] = []

    const initialNodes: Node<any, string | undefined>[] = []

    for (const item of units?.content || []) {
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
  }, [units, refetchUnits])

  if (isLoadingUnits && !isFetchedUnits)
    return (
      <Flex width='100vw' height='100vh' justifyContent='center' alignItems='center'>
        <Loading />
      </Flex>
    )

  return (
    <Box display='flex' flexDirection='column' position='relative'>
      {isTeacher && (
        <>
          <ActionSetting />
          <RightAction lessonPlanId={lessonPlanId} />
        </>
      )}

      <Box
        style={{
          width: '100%',
          height: '100vh',
          // background: 'linear-gradient(135deg, #007BFF 0%, #FFA500 100%)',
        }}
        py={4}
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
          onNodeClick={handleNodeClick}
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
        ></Box>
      </Box>

      {isLoadingUpdateUnit && (
        <Box position='absolute' bottom={10} left={10}>
          <Loading />
        </Box>
      )}
    </Box>
  )
}
