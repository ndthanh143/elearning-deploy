import { ConfirmPopup, Flex } from '@/components'
import { useAlert } from '@/hooks'
import { userKeys } from '@/services/user/user.query'
import { userService } from '@/services/user/user.service'
import {
  Avatar,
  Button,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const convertStatus = (status: number) => {
  switch (status) {
    case 1:
      return (
        <Typography variant='body2' color='success.main'>
          Active
        </Typography>
      )
    case 0:
      return (
        <Typography variant='body2' color='error.main'>
          Deactivated
        </Typography>
      )
    default:
      return <Typography>--</Typography>
  }
}

const PAGE_SIZE = 5
export function TeacherTab() {
  const { triggerAlert } = useAlert()
  const [page, setPage] = useState(0)
  const userInstance = userKeys.listTeacher({ page, size: PAGE_SIZE })
  const { data, refetch } = useQuery(userInstance)

  const [selectedActive, setSelectedActive] = useState<number | null>(null)
  const [selectedDeactivated, setSelectedDeactivated] = useState<number | null>(null)

  const handleCloseConfirm = () => {
    selectedActive && setSelectedActive(null)
    selectedDeactivated && setSelectedDeactivated(null)
  }

  const { mutate } = useMutation({
    mutationFn: userService.updateStatusTeacher,
    onSuccess: () => {
      refetch()
      triggerAlert('Update status successfully', 'success')
      handleCloseConfirm()
    },
    onError: () => {
      triggerAlert('Update status failed', 'error')
    },
  })

  const handleActive = () => {
    selectedActive && mutate({ teacherId: selectedActive, status: 1 })
  }
  const handleDeactivated = () => {
    selectedDeactivated && mutate({ teacherId: selectedDeactivated, status: 0 })
  }

  return (
    <Stack gap={1}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.content.map((item) => (
            <TableRow>
              <TableCell>
                <Flex gap={2}>
                  <Avatar src={item.avatarPath} sizes='small' />
                  <Typography variant='body2'>{item.fullName}</Typography>
                </Flex>
              </TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{convertStatus(item.status)}</TableCell>
              <TableCell>
                <Flex gap={1}>
                  <Button
                    variant={item.status === 1 ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => item.status === 0 && setSelectedActive(item.id)}
                  >
                    Active
                  </Button>
                  <Button
                    variant={item.status === 0 ? 'contained' : 'outlined'}
                    color='error'
                    onClick={() => item.status === 1 && setSelectedDeactivated(item.id)}
                  >
                    Deactivated
                  </Button>
                </Flex>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={page + 1}
        count={data?.totalPages}
        sx={{ mt: 1, mx: 'auto' }}
        onChange={(_, page) => setPage(page - 1)}
      />
      <ConfirmPopup
        isOpen={!!selectedActive || !!selectedDeactivated}
        title={selectedActive ? 'Confirm Active' : 'Confirm Deactivated'}
        subtitle={selectedActive ? 'Are you sure to active this user?' : 'Are you sure to deactivated this user?'}
        type={selectedActive ? 'confirm' : 'delete'}
        onClose={handleCloseConfirm}
        onAccept={selectedActive ? handleActive : handleDeactivated}
      />
    </Stack>
  )
}
