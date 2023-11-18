import { defineQuery } from '../../utils'
import { getListStudentCourseQuery } from './coursesRegistration.dto'
import { coursesRegistrationService } from './coursesRegistration.service'

export const coursesRegistrationKeys = {
  all: ['coursesRegistration'] as const,
  lists: () => [...coursesRegistrationKeys.all, 'lists'] as const,
  list: (query: getListStudentCourseQuery) =>
    defineQuery([...coursesRegistrationKeys.lists(), query], () =>
      coursesRegistrationService.getCoursesRegistrationStudent(query),
    ),
}
