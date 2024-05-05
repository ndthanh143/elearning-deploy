import { Unit } from '@/services/unit/types'

export const isMicroItem = (unit: Unit) => {
  return unit.lectureInfo || unit.resourceInfo || unit.assignmentInfo || unit.quizInfo
}

export const handleMappedUnits = (units: Unit[]) => {
  return units.reduce(
    (acc, cur) => {
      if (isMicroItem(cur)) {
        return {
          ...acc,
          children: [...acc.children, cur],
        }
      } else {
        return {
          ...acc,
          group: [...acc.group, cur],
        }
      }
    },
    { group: [] as Unit[], children: [] as Unit[] },
  )
}

export const handleMappedChildrenUnitByParent = ({ group, children }: { group: Unit[]; children: Unit[] }) => {
  return group.reduce((acc, cur) => {
    const listChildren = children.filter((child) => child.parent?.id === cur.id)

    return {
      ...acc,
      [cur.id]: {
        ...cur,
        children: listChildren,
      },
    }
  }, {})
}

export const handleCountItemInParent = (children: Unit[]) => {
  return children.reduce(
    (acc, cur) => {
      if (cur.lectureInfo) {
        return {
          ...acc,
          lecture: acc.lecture + 1,
        }
      }
      if (cur.assignmentInfo) {
        return {
          ...acc,
          assignment: acc.assignment + 1,
        }
      }
      if (cur.quizInfo) {
        return {
          ...acc,
          quiz: acc.quiz + 1,
        }
      }
      return acc
    },
    { lecture: 0, assignment: 0, quiz: 0 },
  )
}
