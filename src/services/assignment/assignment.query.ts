import { defineQuery } from '../../utils'
import { assignmentService } from './assignment.service'

export const assignmentKeys = {
  all: ['assignment'] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (assignmentId: number) =>
    defineQuery([...assignmentKeys.details(), assignmentId], () => assignmentService.getDetail(assignmentId)),
}
