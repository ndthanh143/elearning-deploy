import { userKeys } from '@/services/user/user.query'
import { DeleteOutline, EditOutlined, SearchOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ModalCreateUser } from './components/ModalCreateUser'
import { useBoolean } from '@/hooks'
import { useState } from 'react'
import { Account } from '@/services/user/user.dto'
import { userService } from '@/services/user/user.service'
import { toast } from 'react-toastify'

export const UserManagement = () => {
  const [page, setPage] = useState(0)

  const userInstance = userKeys.fullList({ page, size: 9 })
  const { data: users } = useQuery(userInstance)

  const [selectedUser, setSelectedUser] = useState<Account | null>(null)

  const { value: isOpenCreateModal, setFalse: closeCreateModal, setTrue: openCreateModal } = useBoolean()

  const { mutate: mutateDelete } = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      toast.success('Delete user successfuly')
    },
  })

  return (
    <Box>
      <Stack direction='row' gap={1} justifyContent='space-between'>
        <TextField size='small' placeholder='Search user' InputProps={{ endAdornment: <SearchOutlined /> }} />
        <Button onClick={openCreateModal} variant='contained'>
          Create new
        </Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Full name</TableCell>
            <TableCell>Nation</TableCell>
            <TableCell>Role</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.content.map((item) => (
            <TableRow>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.nationInfo?.nationName}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>
                <Stack direction='row'>
                  <IconButton onClick={() => setSelectedUser(item)}>
                    <EditOutlined color='primary' />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      mutateDelete(item.id)
                    }}
                  >
                    <DeleteOutline color='error' />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <Pagination
          page={page + 1}
          count={users?.totalPages}
          sx={{ mt: 1 }}
          onChange={(_, page) => setPage(page - 1)}
        />
      </Table>
      <ModalCreateUser isOpen={isOpenCreateModal} onClose={closeCreateModal} status='create' />
      {selectedUser && (
        <ModalCreateUser
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          status='update'
          defaultValue={selectedUser}
        />
      )}
    </Box>
  )
}
