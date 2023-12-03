import { defineQuery } from '../../utils'
import { assignmentSubmissionService } from './assignmentSubmission.service'

export const assignmentKeys = {
  all: ['assignmentSubmission'] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (assignmentId: number) =>
    defineQuery([...assignmentKeys.details(), assignmentId], () => assignmentSubmissionService.getDetail(assignmentId)),
}
