import { CustomModal, CustomSelect, Flex, Loading, NoData } from '@/components'
import { useAlert } from '@/hooks'
import { versionService } from '@/services'
import { VERSION_STATE } from '@/services/course/course.dto'
import { versionKey } from '@/services/version/query'
import { gray } from '@/styles/theme'
import { formatDate, getAbsolutePathFile } from '@/utils'
import {
  Avatar,
  Box,
  Button,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const PAGE_SIZE = 5
export function AdminCourseManagementPage() {
  const { triggerAlert } = useAlert()
  const [note, setNote] = useState('')
  const [selectedState, setSelectedState] = useState<number>(2)
  const [page, setPage] = useState(0)
  const courseInstance = versionKey.list({ state: selectedState, page, size: PAGE_SIZE })
  const { data: versions, refetch, isFetched, isFetching } = useQuery({ ...courseInstance })

  const [selectedReject, setSelectedReject] = useState<number>()

  const data = [
    {
      label: 'Request',
      value: 2,
    },
    {
      label: 'Published',
      value: 3,
    },
    {
      label: 'Rejected',
      value: 4,
    },
  ]

  const { mutate: mutateChangeState } = useMutation({
    mutationFn: versionService.changeState,
    onSuccess: () => {
      refetch()
      selectedReject && handleCloseRejectNote()
      triggerAlert('Update status successfully', 'success')
    },
  })

  const handleApprove = (versionId: number) => {
    mutateChangeState({ versionId, state: VERSION_STATE.approved })
  }

  const handleReject = () => {
    selectedReject && mutateChangeState({ versionId: selectedReject, state: VERSION_STATE.rejected, note })
  }

  const handleCloseRejectNote = () => {
    setSelectedReject(undefined)
  }

  useEffect(() => {
    if (selectedState && isFetched && page) {
      refetch()
    }
  }, [selectedState, page])

  return (
    <Stack>
      <Typography variant='h2' fontWeight={700}>
        Course Publishment Management
      </Typography>
      <Flex justifyContent='end'>
        <CustomSelect
          value={selectedState}
          data={data}
          sx={{ width: 150 }}
          size='small'
          onChange={(e) => setSelectedState(e.target.value as number)}
        />
      </Flex>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {versions?.content.map((item) => (
            <TableRow
              sx={{
                ':hover': {
                  bgcolor: gray[100],
                  cursor: 'pointer',
                },
              }}
            >
              <TableCell>
                <Flex gap={2}>
                  <Avatar
                    src={getAbsolutePathFile(item.courseInfo.thumbnail)}
                    alt={item.courseInfo.courseName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Stack>
                    <Typography variant='body2' fontWeight={700}>
                      {item.courseInfo.courseName}
                    </Typography>
                  </Stack>
                </Flex>
              </TableCell>

              <TableCell>{formatDate.toCommon(item.courseInfo.createDate)}</TableCell>
              <TableCell>
                {item.state === VERSION_STATE.approved && (
                  <Typography variant='body2' color='success.main'>
                    Approved
                  </Typography>
                )}
                {item.state === VERSION_STATE.rejected && (
                  <Typography variant='body2' color='error.main'>
                    Rejected
                  </Typography>
                )}
                {item.state === VERSION_STATE.pending && <Typography variant='body2'>Pending</Typography>}
              </TableCell>
              <TableCell>
                <Stack direction='row' gap={1}>
                  <Button
                    variant='outlined'
                    onClick={() => handleApprove(item.id)}
                    disabled={!!(item.state === VERSION_STATE.approved)}
                    sx={{ opacity: item.state === VERSION_STATE.approved ? 0.4 : 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => setSelectedReject(item.id)}
                    disabled={!!(item.state === VERSION_STATE.rejected)}
                    sx={{ opacity: item.state === VERSION_STATE.rejected ? 0.4 : 1 }}
                  >
                    Reject
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isFetching && <Loading />}
      {isFetched && !isFetching && !versions?.content.length && (
        <Box sx={{ my: 2 }}>
          <NoData />
        </Box>
      )}
      <Pagination
        page={page + 1}
        count={versions?.totalPages}
        sx={{ mt: 1, mx: 'auto' }}
        onChange={(_, page) => setPage(page - 1)}
      />
      {/* <ConfirmPopup isOpen title='Accept Publish Course' subtitle='are you sure to allow to publish this course?' /> */}

      <CustomModal isOpen={!!selectedReject} title='Reject Note' maxWidth={400} onClose={handleCloseRejectNote}>
        <Stack gap={1}>
          <Typography variant='body2' fontWeight={500}>
            Content
          </Typography>
          <TextField value={note} onChange={(e) => setNote(e.target.value)} placeholder='Type reason...' minRows={3} />
          <Button variant='contained' onClick={handleReject} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Stack>
      </CustomModal>
    </Stack>
  )
}
