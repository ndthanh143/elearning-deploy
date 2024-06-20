import { Unit } from '@/services/unit/types'

export const getTypeUnit = (unit: Unit) => {
  let childType: 'lecture' | 'assignment' | 'resource' | 'quiz' | 'video' = 'lecture'
  if (unit.lectureInfo) {
    childType = 'lecture'
  }
  if (unit.assignmentInfo) {
    childType = 'assignment'
  }
  if (unit.resourceInfo) {
    childType = 'resource'
    if (unit.resourceInfo.urlDocument.includes('VIDEO')) {
      childType = 'video'
    }
  }
  if (unit.quizInfo) {
    childType = 'quiz'
  }
  return childType
}
