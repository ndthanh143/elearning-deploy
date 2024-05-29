import { NodeProps } from 'reactflow'
import { MutableRefObject } from 'react'

import { useAuth } from '@/hooks'
import { Unit } from '@/services/unit/types'

import { TeacherCustomNodeComponent } from './TeacherCustomNodeComponent'
import { StudentCustomNodeComponent } from './StudentCustomNodeComponent'

export const CustomNodeComponent = (props: NodeProps<Unit & { parentRef: MutableRefObject<HTMLDivElement> }>) => {
  const { profile } = useAuth()
  const isTeacher = profile?.data.role === 'Teacher'

  if (isTeacher) {
    return <TeacherCustomNodeComponent {...props} />
  } else {
    return <StudentCustomNodeComponent {...props} />
  }
}
