import { CustomSelect, Flex } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { gray } from '@/styles/theme'
import { formatDate, getAbsolutePathFile } from '@/utils'
import { CancelRounded, CheckRounded } from '@mui/icons-material'
import {
  Avatar,
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
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const PAGE_SIZE = 10
export function AdminCourseManagementPage() {
  const [page, setPage] = useState(1)
  const courseInstance = courseKeys.list({ page, size: PAGE_SIZE })
  const { data: courses } = useQuery({ ...courseInstance })

  const data = [
    {
      label: 'Request',
      value: 'request',
    },
    {
      label: 'Published',
      value: 'published',
    },
    {
      label: 'Rejected',
      value: 'rejected',
    },
  ]
  return (
    <Stack>
      <Typography variant='h2' fontWeight={700}>
        Course Publishment Management
      </Typography>
      <Flex justifyContent='end'>
        <CustomSelect value={'request'} data={data} sx={{ width: 150 }} size='small' />
      </Flex>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Plan type</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses?.content.map((item) => (
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
                    src={getAbsolutePathFile(item.thumbnail)}
                    alt={item.courseName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Stack>
                    <Typography variant='body2' fontWeight={700}>
                      {item.courseName}
                    </Typography>
                  </Stack>
                </Flex>
              </TableCell>
              <TableCell>
                {item.price}
                {item.currency}
              </TableCell>
              <TableCell>{item.lessonPlanInfo.type}</TableCell>
              <TableCell>{formatDate.toCommon(item.createDate)}</TableCell>
              <TableCell>
                <Stack direction='row'>
                  <IconButton onClick={() => {}}>
                    <CheckRounded color='success' />
                  </IconButton>
                  <IconButton>
                    <CancelRounded color='error' />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <Pagination
          page={page + 1}
          count={courses?.totalPages}
          sx={{ mt: 1 }}
          onChange={(_, page) => setPage(page - 1)}
        />
      </Table>
      {/* <ConfirmPopup isOpen title='Accept Publish Course' subtitle='are you sure to allow to publish this course?' /> */}
    </Stack>
  )
}
