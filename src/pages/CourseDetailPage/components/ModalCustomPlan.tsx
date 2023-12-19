import { BoxContent, ConfirmPopup } from '@/components'
import { useAuth } from '@/hooks'
import { Course } from '@/services/course/course.dto'
import { courseKeys } from '@/services/course/course.query'
import { courseService } from '@/services/course/course.service'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { CheckOutlined, CloseOutlined, HandshakeOutlined } from '@mui/icons-material'
import { Divider, IconButton, List, ListItem, ListItemText, Modal, Stack, Tooltip, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

type ModalCustomPlanProps = {
  isOpen: boolean
  onClose: () => void
  course: Course
}
export const ModalCustomPlan = ({ isOpen, onClose, course }: ModalCustomPlanProps) => {
  const queryClient = useQueryClient()

  const { profile } = useAuth()
  const lessonPlansInstance = lessonPlanKey.list({ teacherId: Number(profile?.data.id) })
  const { data } = useQuery({ ...lessonPlansInstance, select: (data) => data.content })
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlan | null>(null)

  const { mutate: mutateUpdateCourse } = useMutation({
    mutationFn: courseService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
      toast.success('Update lesson plan successfully')
      onClose()
    },
  })

  const handleCloseConfirm = () => setSelectedLessonPlan(null)

  const handleUpdateLessonPlan = () => {
    handleCloseConfirm()
    selectedLessonPlan && mutateUpdateCourse({ id: course.id, lessonPlanId: selectedLessonPlan.id, state: 1 })
  }

  return (
    <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BoxContent minWidth={500}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h5'>Your current planning</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider />
        <List>
          {data?.map((lessonPlan) => (
            <ListItem
              secondaryAction={
                lessonPlan.id === course.lessonPlanInfo?.id ? (
                  <Tooltip title='Current plan' sx={{ mr: 1 }}>
                    <CheckOutlined color='primary' />
                  </Tooltip>
                ) : (
                  <IconButton onClick={() => setSelectedLessonPlan(lessonPlan)}>
                    <HandshakeOutlined />
                  </IconButton>
                )
              }
            >
              <ListItemText primary={lessonPlan.name} secondary={lessonPlan.description} />
            </ListItem>
          ))}
        </List>
        {selectedLessonPlan && (
          <ConfirmPopup
            isOpen={Boolean(selectedLessonPlan)}
            onClose={handleCloseConfirm}
            onAccept={handleUpdateLessonPlan}
            title='Confirm Action'
            subtitle='Are you sure to apply this plan to your course?'
          />
        )}
      </BoxContent>
    </Modal>
  )
}
