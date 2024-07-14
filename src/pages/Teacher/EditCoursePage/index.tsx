import { Loading, LoadingOverlay } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { courseService } from '@/services/course/course.service'
import { Container } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { CreateCoursePayload, UpdateCoursePayload } from '@/services/course/course.dto'
import { FormCourseHandle } from '../CreateNewCoursePage/components'
import { useAlert } from '@/hooks'

export function EditCoursePage() {
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()

  const { courseId } = useParams()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: courseData } = useQuery({ ...courseInstance })

  const { mutate: mutateUpdateCourse, isPending: isLoadingUpdate } = useMutation({
    mutationFn: courseService.update,
    onSuccess: () => {
      triggerAlert('Update course successfully!', 'success')
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
    onError: () => {
      triggerAlert('Update course failed!', 'error')
    },
  })

  const handleSubmit = (payload: CreateCoursePayload) => {
    mutateUpdateCourse({ ...(payload as UpdateCoursePayload), id: Number(courseId) })
  }

  if (!courseData) {
    return <Loading />
  }

  return (
    <>
      <Container>
        <FormCourseHandle handleSubmit={handleSubmit} defaultValues={courseData} />
      </Container>
      <LoadingOverlay isOpen={isLoadingUpdate} title='Updating your class...' />
    </>
  )
}
