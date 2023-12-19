import { defineQuery } from '../../utils'
import { GetStudentsQuery, SearchStudentQuery } from './user.dto'
import { userService } from './user.service'

export const userKeys = {
  all: ['users'] as const,
  profiles: () => [...userKeys.all, 'profile'] as const,
  profile: () => defineQuery([...userKeys.profiles()], userService.getCurrentUser),
  schedules: () => [...userKeys.all, 'schedule'] as const,
  schedule: () => defineQuery([...userKeys.schedules()], userService.getSchedule),
  members: () => [...userKeys.all, 'member'] as const,
  member: () => defineQuery([...userKeys.members()], userService.getRelativeMember),
  lists: () => [...userKeys.all, 'list'] as const,
  list: (query: GetStudentsQuery) => defineQuery([...userKeys.lists(), query], () => userService.getStudents(query)),
  searches: () => [...userKeys.all, 'search'] as const,
  search: (query: SearchStudentQuery) =>
    defineQuery([...userKeys.searches(), query], () => userService.searchStudents(query)),
}
