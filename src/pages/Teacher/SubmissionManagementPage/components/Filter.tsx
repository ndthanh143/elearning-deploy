import { CustomSelect, Flex } from '@/components'
import { Course } from '@/services/course/course.dto'

export function Filter({ courses }: { courses: Course[] }) {
  const selectDataTypeSubmit = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Submitted',
      value: 'submitted',
    },
    {
      label: 'Unsubmitted',
      value: 'unsubmitted',
    },
  ]

  return (
    <Flex gap={2}>
      <CustomSelect
        data={courses.map((course) => ({
          label: course.courseName,
          value: course.id,
        }))}
        defaultValue={''}
        size='small'
      />
      <CustomSelect data={selectDataTypeSubmit} defaultValue={selectDataTypeSubmit[0].value} size='small' />
    </Flex>
  )
}
