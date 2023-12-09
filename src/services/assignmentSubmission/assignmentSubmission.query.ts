import { defineQuery } from '../../utils'
import { GetSubmissionQuery } from './assignmentSubmission.dto'
import { assignmentSubmissionService } from './assignmentSubmission.service'

export const assignmentSubmissionKeys = {
  all: ['assignmentSubmission'] as const,
  lists: () => [...assignmentSubmissionKeys.all, 'detail'] as const,
  list: (query: GetSubmissionQuery = {}) =>
    defineQuery([...assignmentSubmissionKeys.lists(), query], () => assignmentSubmissionService.getList(query)),
}
