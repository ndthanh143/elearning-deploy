import { defineQuery } from '../../utils'
import { courseService } from './course.service'

export const courseKeys = {
  all: ['course'] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (courseId: number) =>
    defineQuery([...courseKeys.details(), courseId], () => courseService.getCourseDetail(courseId)),
}
