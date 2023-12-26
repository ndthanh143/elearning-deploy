import { BoxContent } from '@/components'
import { nationKeys } from '@/services/nation/query'
import { roleKeys } from '@/services/role/query'
import { Account } from '@/services/user/user.dto'
import { userService } from '@/services/user/user.service'
import { yupResolver } from '@hookform/resolvers/yup'
import { CloseOutlined } from '@mui/icons-material'
import { Button, Divider, IconButton, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { number, object, string } from 'yup'

export interface IModalCreateUser {
  isOpen: boolean
  onClose: () => void
  status: 'update' | 'create'
  defaultValue?: Account
}

const schema = object({
  fullName: string().required(),
  avatarPath: string().required(),
  email: string().required(),
  kind: number().required(),
  roleId: number().required(),
  password: string().required(),
  nationId: number().required(),
})

export const ModalCreateUser = ({ isOpen, onClose, defaultValue, status }: IModalCreateUser) => {
  const roleInstance = roleKeys.list()
  const { data: roles } = useQuery({ ...roleInstance })

  const nationInstance = nationKeys.list()
  const { data: nations } = useQuery({ ...nationInstance })

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      avatarPath: 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png',
      kind: 1,
      email: defaultValue?.email,
      fullName: defaultValue?.fullName,
      nationId: defaultValue?.nationInfo.id,
      roleId: defaultValue?.roleInfo.id,
    },
  })

  const { mutate } = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      onClose()
      toast.success('Create new user successfully')
    },
  })

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: userService.update,
    onSuccess: () => {
      onClose()
      toast.success('Update user successfully')
    },
  })

  const onSubmitHandler = (data: any) => {
    status === 'create' ? mutate(data) : mutateUpdate({ ...data, id: defaultValue?.id })
  }
  return (
    <Modal open={isOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClose={onClose}>
      <BoxContent minWidth={500} component='form' onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h5' mb={1}>
            {status === 'create' ? 'Create' : 'Update'} User
          </Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Divider />
        <Stack my={2} gap={2}>
          <Stack>
            <Typography>Name</Typography>
            <TextField size='small' fullWidth placeholder='Name' {...register('fullName')} />
          </Stack>
          <Stack>
            <Typography>Email</Typography>
            <TextField
              size='small'
              fullWidth
              placeholder='Email'
              {...register('email')}
              disabled={status === 'update'}
            />
          </Stack>
          {status === 'create' && (
            <Stack>
              <Typography>Password</Typography>
              <TextField size='small' fullWidth placeholder='Password' type='password' {...register('password')} />
            </Stack>
          )}
          <Stack>
            <Typography>Role</Typography>
            <Select {...register('roleId')} size='small' defaultValue={defaultValue?.roleInfo?.id}>
              {roles?.map((role: any) => <MenuItem value={role.id}>{role.name}</MenuItem>)}
            </Select>
          </Stack>
          <Stack>
            <Typography>Nation</Typography>

            <Select size='small' {...register('nationId')} defaultValue={defaultValue?.nationInfo?.id}>
              {nations?.content.map((nation: any) => <MenuItem value={nation.id}>{nation.nationName}</MenuItem>)}
            </Select>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction='row' gap={2} mt={2} justifyContent='end'>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            {status === 'create' ? 'Create' : 'Update'}
          </Button>
        </Stack>
      </BoxContent>
    </Modal>
  )
}
