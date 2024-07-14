import { defineQuery } from '../../utils'
import { GetAssignmentDetailParams, GetListAssignmentQuery, GetScheduleQuery } from './assignment.dto'
import { assignmentService } from './assignment.service'

export const assignmentKeys = {
  all: ['assignment'] as const,
  lists: () => [...assignmentKeys.all, 'list'] as const,
  list: (query: GetListAssignmentQuery) =>
    defineQuery([...assignmentKeys.lists(), query], () => assignmentService.getList(query)),
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (params: GetAssignmentDetailParams) =>
    defineQuery([...assignmentKeys.details(), params], () => assignmentService.getDetail(params)),
  schedules: () => [...assignmentKeys.all, 'assignment-schedule'] as const,
  schedule: (query: GetScheduleQuery) =>
    defineQuery([...assignmentKeys.details(), query], () => assignmentService.getSchedule(query)),
}
