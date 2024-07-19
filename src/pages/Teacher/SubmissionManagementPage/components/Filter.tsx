import { CustomSelect, Flex } from '@/components'
import { Course } from '@/services/course/course.dto'

export function Filter({
  courses,
  onChangeCourse,
}: {
  selectedCourses?: number
  courses: Course[]
  onChangeCourse: (courseId: number) => void
}) {
  // const selectDataTypeSubmit = [
  //   {
  //     label: 'All',
  //     value: 'all',
  //   },
  //   {
  //     label: 'Submitted',
  //     value: 'submitted',
  //   },
  //   {
  //     label: 'Unsubmitted',
  //     value: 'unsubmitted',
  //   },
  // ]

  return (
    <Flex gap={2}>
      <CustomSelect
        data={[
          { label: 'All', value: 'all' },
          ...courses.map((course) => ({ label: course.courseName, value: course.id })),
        ]}
        defaultValue={'all'}
        size='small'
        onChange={(e) => e.target.value !== 'all' && onChangeCourse(e.target.value as number)}
      />
      {/* <CustomSelect data={selectDataTypeSubmit} defaultValue={selectDataTypeSubmit[0].value} size='small' /> */}
    </Flex>
  )
}
