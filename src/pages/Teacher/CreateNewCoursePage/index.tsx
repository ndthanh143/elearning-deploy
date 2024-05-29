import { LoadingOverlay } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { courseService } from '@/services/course/course.service'
import { Container } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FormCourseHandle } from './components'
import { CreateCoursePayload } from '@/services/course/course.dto'

export function CreateNewCoursePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: mutateCreateCourse, isPending: isLoadingCreate } = useMutation({
    mutationFn: courseService.create,
    onSuccess: (data) => {
      toast.success('Create course successfully!')
      navigate(`/courses/${data.id}`)
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })

  const handleSubmit = (payload: CreateCoursePayload) => {
    mutateCreateCourse(payload)
  }

  return (
    <>
      <Container>
        <FormCourseHandle handleSubmit={handleSubmit} />
      </Container>
      <LoadingOverlay isOpen={isLoadingCreate} title='Creating your class...' />
    </>
  )
}
