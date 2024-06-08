import { NodeProps } from 'reactflow'
import { MutableRefObject } from 'react'

import { useAuth } from '@/hooks'
import { Unit } from '@/services/unit/types'

import { TeacherCustomNodeComponent } from './TeacherCustomNodeComponent'
import { StudentCustomNodeComponent } from './StudentCustomNodeComponent'

export const CustomNodeComponent = (
  props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement>; index: number }>,
) => {
  const { isTeacher } = useAuth()

  return isTeacher ? <TeacherCustomNodeComponent {...props} /> : <StudentCustomNodeComponent {...props} />
}
