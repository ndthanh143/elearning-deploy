import { useAuth } from '@/hooks'
import { StudentCoursesPage, TeacherCoursesPage } from '@/pages'

export function CoursesPageLayout() {
  const { profile } = useAuth()

  if (!profile) {
    return null
  }

  if (profile.data.role === 'Teacher') {
    return <TeacherCoursesPage />
  } else {
    return <StudentCoursesPage />
  }
}
