import { LoadingOverlay } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { courseService } from '@/services/course/course.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FormCourseHandle } from './components'
import { CreateCoursePayload } from '@/services/course/course.dto'
import { useAlert } from '@/hooks'

export function CreateNewCoursePage() {
  const { triggerAlert } = useAlert()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: mutateCreateCourse, isPending: isLoadingCreate } = useMutation({
    mutationFn: courseService.create,
    onSuccess: (data) => {
      triggerAlert('Create course successfully!', 'success')
      navigate(`/courses/${data.id}`)
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
    onError: () => {
      triggerAlert('Create course failed!', 'error')
    },
  })

  const handleSubmit = (payload: CreateCoursePayload) => {
    mutateCreateCourse(payload)
  }

  return (
    <>
      <FormCourseHandle handleSubmit={handleSubmit} />
      <LoadingOverlay isOpen={isLoadingCreate} title='Creating your class...' />
    </>
  )
}
