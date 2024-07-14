import { defineQuery } from '../../utils'
import { GetListStudentCourseQuery, GetMyStudentQuery } from './coursesRegistration.dto'
import { coursesRegistrationService } from './coursesRegistration.service'

export const coursesRegistrationKeys = {
  all: ['coursesRegistration'] as const,
  lists: () => [...coursesRegistrationKeys.all, 'lists'] as const,
  list: (query: GetListStudentCourseQuery) =>
    defineQuery([...coursesRegistrationKeys.lists(), query], () =>
      coursesRegistrationService.getCoursesRegistrationStudent(query),
    ),
  myStudents: () => [...coursesRegistrationKeys.all, 'my-student'] as const,
  myStudent: (query: GetMyStudentQuery) =>
    defineQuery([...coursesRegistrationKeys.myStudents(), query], () =>
      coursesRegistrationService.getMyStudents(query),
    ),
}
