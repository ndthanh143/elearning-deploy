import { useBoolean } from '@/hooks'
import { ModalSection, SectionModalProps } from '@/pages/PlanningPage/modals'
import { unitService } from '@/services/unit'
import { unitKey } from '@/services/unit/query'
import { CreateUnitPayload } from '@/services/unit/types'
import { AddCircleOutlineOutlined } from '@mui/icons-material'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

interface IRightActionProps {
  lessonPlanId: number
}

export function RightAction({ lessonPlanId }: IRightActionProps) {
  const queryClient = useQueryClient()
  const { value: isOpenAddSection, setTrue: openAddSection, setFalse: closeAddSection } = useBoolean()

  const unitInstance = unitKey.list({ lessonPlanId })

  const { mutate } = useMutation({
    mutationFn: unitService.create,
    onSuccess: () => {
      closeAddSection()
      queryClient.invalidateQueries({ queryKey: unitInstance.queryKey })
      toast.success('Create module successfully!')
    },
  })

  const handleCreateSection = (data: SectionModalProps) => {
    const newPosition = {
      x: 0,
      y: 0,
    }

    const payload: CreateUnitPayload = {
      name: data.modulesName,
      description: data.description,
      lessonPlanId,
      position: newPosition,
    }

    mutate(payload)
  }

  return (
    <>
      <Stack
        p={1}
        gap={1}
        position='absolute'
        right={10}
        top='50%'
        bgcolor='white'
        border={1}
        borderColor={'#ededed'}
        borderRadius={8}
        sx={{ transform: 'translateY(-50%)' }}
        zIndex={10}
      >
        <Tooltip title='Add new section'>
          <IconButton onClick={openAddSection}>
            <AddCircleOutlineOutlined />
          </IconButton>
        </Tooltip>
      </Stack>

      <ModalSection
        status='create'
        isOpen={isOpenAddSection}
        onClose={closeAddSection}
        onSubmit={handleCreateSection}
      />
    </>
  )
}
