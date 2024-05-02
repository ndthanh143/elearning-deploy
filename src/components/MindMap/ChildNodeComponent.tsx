import { NodeProps } from 'reactflow'

import { useAuth } from '@/hooks'
import { Unit } from '@/services/unit/types'

import { TeacherChildNodeComponent } from './TeacherChildNodeComponent'
import { StudentChildNodeComponent } from './StudentChildNodeComponent'

import 'reactflow/dist/style.css'

export const ChildNodeComponent = (props: NodeProps<Unit>) => {
  const { profile } = useAuth()
  const isTeacher = profile?.data.roleInfo.name === 'Teacher'

  if (isTeacher) {
    return <TeacherChildNodeComponent {...props} />
  } else {
    return <StudentChildNodeComponent {...props} />
  }
}
