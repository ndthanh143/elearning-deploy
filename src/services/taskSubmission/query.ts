export const taskSubmissionKeys = {
  all: ['task-submission'] as const,
  lists: () => [...taskSubmissionKeys.all, 'list'] as const,
  // list: (query: GetGroupListQuery) =>
  //   defineQuery([...taskSubmissionKeys.lists(), query], () => groupService.getListGroup(query)),
}
