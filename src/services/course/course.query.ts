import { defineQuery } from '../../utils'
import { courseService } from './course.service'
import { AutoCompleteCourseQuery, GetListCoursesQuery, GetMyCoursesQuery } from './course.dto'

export const courseKeys = {
  all: ['course'] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (courseId: number) =>
    defineQuery([...courseKeys.details(), courseId], () => courseService.getCourseDetail(courseId)),
  publicDetails: () => [...courseKeys.all, 'detail-public'] as const,
  publicDetail: (courseId: number) =>
    defineQuery([...courseKeys.details(), courseId], () => courseService.getCoursePublicDetail(courseId)),
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (query: GetListCoursesQuery = {}) =>
    defineQuery([...courseKeys.lists(), query], () => courseService.getList(query)),
  autoCompletes: () => [...courseKeys.all, 'auto-complete'] as const,
  autoComplete: (query: AutoCompleteCourseQuery = {}) =>
    defineQuery([...courseKeys.autoCompletes(), query], () => courseService.autoComplete(query)),
  myCourses: () => [...courseKeys.all, 'my-course'] as const,
  myCourse: (query: GetMyCoursesQuery) =>
    defineQuery([...courseKeys.myCourses(), query], () => courseService.myCourse(query)),
}
