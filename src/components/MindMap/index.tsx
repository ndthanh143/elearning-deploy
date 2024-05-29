import { useAuth } from '@/hooks'
import { Box } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  updateEdge,
  Connection,
  MarkerType,
  OnNodesChange,
  applyNodeChanges,
} from 'reactflow'

import 'reactflow/dist/style.css'
import { CustomEdge } from './CustomEdge'
import { ChildEdge } from './ChildEdge'
import { CustomNodeComponent } from './CustomNodeComponent'
import { ChildNodeComponent } from './ChildNodeComponent'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ActionSetting } from './components'
import { RightAction } from './components/RightAction'
import { unitKey } from '@/services/unit/query'
import { unitService } from '@/services/unit'
import { Flex, Loading } from '..'
import { CustomConnectionLine } from './CustomConnectionLine'

const nodeTypes = {
  customNode: CustomNodeComponent, // Define your custom node type
  childNode: ChildNodeComponent, // Define your custom node type
}

const edgeTypes = {
  customEdge: CustomEdge,
  childEdge: ChildEdge,
}

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: '#F1D1C3',
}

interface IMindMapProps {
  lessonPlanId: number
}

export function MindMap({ lessonPlanId }: IMindMapProps) {
  const { profile } = useAuth()
  const isTeacher = profile?.data.role === 'Teacher'

  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const scrollContainerRef = useRef(null)

  const unitInstance = unitKey.list({ lessonPlanId, unpaged: true })
  const {
    data: units,
    refetch: refetchUnits,
    isLoading: isLoadingUnits,
    isFetched: isFetchedUnits,
  } = useQuery({ ...unitInstance })
  const { mutate: mutateUpdateUnit, isPending: isLoadingUpdateUnit } = useMutation({ mutationFn: unitService.update })

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
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: isDefaultUnit ? '#F79B8D' : '#7EB6C0',
        },
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
          background: '#FFFDF5',
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
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
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
