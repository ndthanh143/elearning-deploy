import { defineQuery } from '../../utils'
import { GetListStudentCourseQuery } from './coursesRegistration.dto'
import { coursesRegistrationService } from './coursesRegistration.service'

export const coursesRegistrationKeys = {
  all: ['coursesRegistration'] as const,
  lists: () => [...coursesRegistrationKeys.all, 'lists'] as const,
  list: (query: GetListStudentCourseQuery) =>
    defineQuery([...coursesRegistrationKeys.lists(), query], () =>
      coursesRegistrationService.getCoursesRegistrationStudent(query),
    ),
}
