import { useAuth } from '@/hooks'
import { Box } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Connection,
  MarkerType,
  applyNodeChanges,
  Edge,
  OnNodesChange,
  useReactFlow,
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
import { debounce } from 'lodash'
import { primary } from '@/styles/theme'
import { MainNodeComponent } from './MainNodeComponent'

const nodeTypes = {
  customNode: CustomNodeComponent,
  childNode: ChildNodeComponent,
  mainNode: MainNodeComponent,
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

  const { setCenter } = useReactFlow()

  const unitInstance = unitKey.list({ lessonPlanId, unpaged: true })
  const { data: units, isLoading: isLoadingUnits } = useQuery({
    ...unitInstance,
  })
  const { mutate: mutateUpdateUnit, isPending: isLoadingUpdateUnit } = useMutation({ mutationFn: unitService.update })

  // Debounced function to update unit position
  const debouncedUpdateUnit = useCallback(
    debounce((id, position) => {
      mutateUpdateUnit({ id: Number(id), position })
    }, 300), // adjust the delay as needed
    [],
  )

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) =>
        applyNodeChanges(
          changes.map((change) => {
            if (change.type === 'position') {
              const currentNodeChange = nds.find((node) => node.id === change.id)
              if (currentNodeChange) {
                debouncedUpdateUnit(currentNodeChange.id, currentNodeChange.position)
              }
            }
            return change
          }),
          nds,
        ),
      )
    },
    [setNodes, debouncedUpdateUnit],
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
    [mutateUpdateUnit],
  )

  useEffect(() => {
    if (units?.content) {
      const initialNodes = units.content.map((item, index) => ({
        id: item.id.toString(),
        position: item.position || { x: 0, y: 0 },
        data: { ...item, type: index === 0 ? 'main' : 'common' },
        type:
          !item.lectureInfo && !item.assignmentInfo && !item.quizInfo && !item.resourceInfo
            ? 'customNode'
            : 'childNode',
      }))

      const initialEdges = units.content.map((item) => ({
        id: `e${item.parent?.id}-${item.id}`,
        source: item.parent?.id.toString() || '',
        target: item.id.toString(),
        type:
          !item.lectureInfo && !item.assignmentInfo && !item.quizInfo && !item.resourceInfo
            ? 'customEdge'
            : 'childEdge',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color:
            !item.lectureInfo && !item.assignmentInfo && !item.quizInfo && !item.resourceInfo
              ? primary[500]
              : '#7EB6C0',
        },
      }))

      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [units])

  return (
    <Box display='flex' flexDirection='column' position='relative'>
      {isTeacher && (
        <>
          <ActionSetting />
          <RightAction lessonPlanId={lessonPlanId} />
        </>
      )}

      <Flex
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: '100vh', background: '#F8F4FE' }}
        ref={scrollContainerRef}
      >
        {isLoadingUnits ? (
          <Loading />
        ) : (
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
            onEdgeUpdate={onEdgeUpdate}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            panOnScroll
            onlyRenderVisibleElements={false}
            zoomOnDoubleClick={false}
            zoomOnScroll={false}
            preventScrolling={false}
            fitView
            snapToGrid
            connectionLineComponent={CustomConnectionLine}
            connectionLineStyle={connectionLineStyle}
          />
        )}
      </Flex>

      {isLoadingUpdateUnit && (
        <Box position='absolute' bottom={10} left={10}>
          <Loading />
        </Box>
      )}
    </Box>
  )
}
