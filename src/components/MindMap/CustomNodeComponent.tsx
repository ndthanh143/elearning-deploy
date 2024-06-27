import { NodeProps } from 'reactflow'
import { MutableRefObject } from 'react'

import { useAuth } from '@/hooks'
import { Unit } from '@/services/unit/types'

import { TeacherCustomNodeComponent } from './TeacherCustomNodeComponent'
import { CourseCustomNodeComponent } from './StudentCustomNodeComponent'

export const CustomNodeComponent = (
  props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement>; childrens: Unit[] }>,
) => {
  const { isTeacher } = useAuth()

  return isTeacher ? <TeacherCustomNodeComponent {...props} /> : <CourseCustomNodeComponent {...props} />
}
