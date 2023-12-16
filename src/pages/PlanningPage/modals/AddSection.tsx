import { BoxContent } from '@/components'
import { CreateModulePayload } from '@/services/module/module.dto'
import { moduleKey } from '@/services/module/module.query'
import { moduleService } from '@/services/module/module.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { number, object, string } from 'yup'

export type AddSectionProps = {
  isOpen: boolean
  onClose: () => void
  lessonPlanId: number
}

const schema = object({
  description: string().required(),
  lessonPlanId: number().required(),
  modulesName: string().required(),
})

export const AddSection = ({ isOpen, onClose, lessonPlanId }: AddSectionProps) => {
  const queryClient = useQueryClient()

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      lessonPlanId,
    },
  })

  const { mutate } = useMutation({
    mutationFn: moduleService.create,
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({ queryKey: moduleKey.lists() })
      toast.success('Create module successfully!')
    },
  })
  const onSubmitHandler = (data: CreateModulePayload) => {
    mutate(data)
  }

  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <BoxContent width={500} component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={2} my={2}>
          <TextField size='small' fullWidth placeholder='Section name' {...register('modulesName')} />
          <TextField fullWidth placeholder='Description' {...register('description')} />

          <Stack direction='row' justifyContent='end' gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant='contained' type='submit'>
              Create
            </Button>
          </Stack>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
