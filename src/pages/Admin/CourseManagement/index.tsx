import { CustomSelect, Flex, Loading, NoData } from '@/components'
import { versionService } from '@/services'
import { VERSION_STATE } from '@/services/course/course.dto'
import { versionKey } from '@/services/version/query'
import { gray } from '@/styles/theme'
import { formatDate, getAbsolutePathFile } from '@/utils'
import { CancelRounded, CheckRounded } from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
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
import { useEffect, useState } from 'react'

const PAGE_SIZE = 5
export function AdminCourseManagementPage() {
  const [selectedState, setSelectedState] = useState<number>(2)
  const [page, setPage] = useState(0)
  const courseInstance = versionKey.list({ state: selectedState, page, size: PAGE_SIZE })
  const { data: versions, refetch, isFetched, isFetching } = useQuery({ ...courseInstance })

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

  const { mutate: mutateApprove } = useMutation({
    mutationFn: versionService.changeState,
    onSuccess: () => {
      refetch()
    },
  })

  const handleApprove = (versionId: number) => {
    mutateApprove({ versionId, state: VERSION_STATE.approved })
  }

  const handleReject = (versionId: number) => {
    mutateApprove({ versionId, state: VERSION_STATE.rejected })
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
            <TableCell>Price</TableCell>
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
              <TableCell>
                {item.courseInfo.price}
                {item.courseInfo.currency}
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
                <Stack direction='row'>
                  <IconButton
                    onClick={() => handleApprove(item.id)}
                    disabled={!!(item.state === VERSION_STATE.approved)}
                    sx={{ opacity: item.state === VERSION_STATE.approved ? 0.4 : 1 }}
                  >
                    <CheckRounded color='success' />
                  </IconButton>
                  <IconButton
                    onClick={() => handleReject(item.id)}
                    disabled={!!(item.state === VERSION_STATE.rejected)}
                    sx={{ opacity: item.state === VERSION_STATE.rejected ? 0.4 : 1 }}
                  >
                    <CancelRounded color='error' />
                  </IconButton>
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
    </Stack>
  )
}
