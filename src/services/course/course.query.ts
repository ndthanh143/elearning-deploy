import { defineQuery } from '../../utils'
import { GetListCoursesQuery } from './course.dto'
import { courseService } from './course.service'

export const courseKeys = {
  all: ['course'] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (courseId: number) =>
    defineQuery([...courseKeys.details(), courseId], () => courseService.getCourseDetail(courseId)),
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (query: GetListCoursesQuery = {}) =>
    defineQuery([...courseKeys.details(), query], () => courseService.getList(query)),
}
