import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Modal, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { BoxContent } from '.'

export type UrlPopupProps = {
  placeholder?: string
  url?: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string) => void
}

const schema = object({
  url: string().required('Please add your url link'),
})
export const UrlPopup = ({ placeholder = 'Fill your link', url, isOpen, onClose, onSubmit }: UrlPopupProps) => {
  const { register, handleSubmit, reset } = useForm<{ url: string }>({
    resolver: yupResolver(schema),
    defaultValues: {
      url,
    },
  })

  const onSubmitHandler = (data: { url: string }) => {
    onSubmit(data.url)
    reset()
  }

  return (
    <Modal open={isOpen} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BoxContent
        component='form'
        onSubmit={handleSubmit(onSubmitHandler)}
        minWidth={400}
        display='flex'
        flexDirection='column'
        gap={2}
      >
        <TextField placeholder={placeholder} value={url} {...register('url')} />
        <Stack direction='row' gap={2} justifyContent='end'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
