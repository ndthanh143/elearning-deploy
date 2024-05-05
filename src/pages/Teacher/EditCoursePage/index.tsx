import { Loading, LoadingOverlay } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { courseService } from '@/services/course/course.service'
import { Container } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CreateCoursePayload, UpdateCoursePayload } from '@/services/course/course.dto'
import { FormCourseHandle } from '../CreateNewCoursePage/components'

export function EditCoursePage() {
  const queryClient = useQueryClient()

  const { courseId } = useParams()

  const courseInstance = courseKeys.detail(Number(courseId))
  const { data: courseData } = useQuery({ ...courseInstance })

  const { mutate: mutateUpdateCourse, isPending: isLoadingUpdate } = useMutation({
    mutationFn: courseService.update,
    onSuccess: () => {
      toast.success('Update course successfully!')
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
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
      <Container maxWidth='lg'>
        <FormCourseHandle handleSubmit={handleSubmit} defaultValues={courseData} />
      </Container>
      <LoadingOverlay isOpen={isLoadingUpdate} title='Updating your class...' />
    </>
  )
}
