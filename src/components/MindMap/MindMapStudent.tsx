import { Box, IconButton } from '@mui/material'
import { useCallback, useEffect } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Node, Edge, MarkerType } from 'reactflow'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

import { CustomEdge } from './CustomEdge'
import { ChildEdge } from './ChildEdge'
import { ProfileSetting } from './components/actions'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { CustomTooltip, Loading } from '..'
import { primary } from '@/styles/theme'

import { CourseCustomNodeComponent } from './StudentCustomNodeComponent'
import { CourseChildNodeComponent } from './StudentChildNodeComponent'
import { useLocation } from 'react-router-dom'
import { Unit } from '@/services/unit/types'
import { MainNodeComponent } from './MainNodeComponent'
import { RightActionStudent } from './components'

import 'reactflow/dist/style.css'

const nodeTypes = {
  customNode: CourseCustomNodeComponent, // Define your custom node type
  childNode: CourseChildNodeComponent, // Define your custom node type
  mainNode: MainNodeComponent,
}

const edgeTypes = {
  customEdge: CustomEdge,
  childEdge: ChildEdge,
}

interface IMindMapProps {
  lessonPlan: LessonPlan
  isLoading: boolean
}

export function MindMapStudent({ lessonPlan, isLoading }: IMindMapProps) {
  const [nodes, setNodes] = useNodesState([])
  const [storeNodes, setStoreNodes] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { hash } = useLocation()
  const hashId = hash.replace('#', '')

  const units = lessonPlan.units

  useEffect(() => {
    const initialEdges: Edge[] = []

    const initialNodes: Node<any, string | undefined>[] = []
    const dataNodesTemp: Record<string, Unit[]> = {}

    for (const item of units || []) {
      const parentNodeId = item.parent?.id.toString()

      const isDefaultUnit = !Boolean(item.lectureInfo || item.assignmentInfo || item.quizInfo || item.resourceInfo)

      if (!isDefaultUnit && parentNodeId) {
        dataNodesTemp[parentNodeId] = dataNodesTemp[parentNodeId] ? [...dataNodesTemp[parentNodeId], item] : [item]
      }
    }

    let index = 0
    for (const item of units || []) {
      const isDefaultUnit = !Boolean(item.lectureInfo || item.assignmentInfo || item.quizInfo || item.resourceInfo)
      const currentNodeId = item.id.toString()
      const parentNodeId = item.parent?.id.toString()

      const node = {
        id: currentNodeId,
        position: item.position || { x: 0, y: 0 },
        data: {
          index,
          ...item,
          hidden: !isDefaultUnit,
          childrens: dataNodesTemp[currentNodeId || ''] || [],
        },
        type: index === 0 ? 'mainNode' : isDefaultUnit ? 'customNode' : 'childNode',
        ...(parentNodeId && {
          parentNodeId,
        }),
      }

      initialNodes.push(node)
      initialEdges.push({
        id: `e${parentNodeId}-${currentNodeId}`,
        source: parentNodeId || '',
        target: currentNodeId,
        type: isDefaultUnit ? 'customEdge' : 'childEdge',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: isDefaultUnit ? primary[500] : '#7EB6C0',
        },
      })
      index++
    }

    setNodes(initialNodes)

    setEdges(initialEdges)
  }, [units])

  const toggleFullscreen = () => {
    const isFullscreen = hashId === 'fullscreen'
    window.location.hash = isFullscreen ? '' : 'fullscreen'
  }

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (nodes?.length) {
        const updateNodes = nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            hidden: n.data.parent && n.data.parent?.id.toString() == node.id ? !n.data.hidden : n.data.hidden,
          },
        }))
        setNodes(updateNodes)
      }
    },
    [storeNodes, nodes, setNodes, setStoreNodes],
  )

  const isFullscreen = hashId === 'fullscreen'

  const handleToggleLessons = (type: 'on' | 'off') => {
    const updateNodes = nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        hidden: type === 'on' ? false : true,
      },
    }))
    setNodes(updateNodes)
  }

  return (
    <Box display='flex' flexDirection='column' position='relative' boxShadow={2} borderRadius={3} overflow='hidden'>
      <CustomTooltip title={isFullscreen ? 'Exist full screen' : 'View full screen'}>
        <IconButton
          onClick={toggleFullscreen}
          sx={{
            position: isFullscreen ? 'fixed' : 'absolute',
            ...(!isFullscreen
              ? {
                  top: 16,
                  left: 16,
                }
              : { bottom: 16, left: 16 }),
            zIndex: isFullscreen ? 10000 : 1,
          }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </CustomTooltip>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          position: isFullscreen ? 'fixed' : 'relative',
          transition: 'all ease-in-out 0.2s',
          top: 0,
          left: 0,
          background: '#F8F4FE',
          zIndex: isFullscreen ? 1000 : 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ProfileSetting lessonPlanId={lessonPlan.id} />
        {isLoading ? (
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
            onNodeClick={onNodeClick}
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
          />
        )}
      </Box>
      {isFullscreen && <RightActionStudent toggleViewLessons={handleToggleLessons} />}
    </Box>
  )
}
