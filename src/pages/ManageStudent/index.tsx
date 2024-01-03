import { BoxContent, ConfirmPopup, NoData } from '@/components'
import { ModalAddStudentToCourse } from '@/components/ModalAddStudentToCourse'
import { useAuth, useBoolean } from '@/hooks'
import { Course } from '@/services/course/course.dto'
import { courseKeys } from '@/services/course/course.query'
import { userKeys } from '@/services/user/user.query'
import { AddOutlined, DeleteOutline } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Grid,
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
import { blue } from '@mui/material/colors'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const ManageStudent = () => {
  const { profile } = useAuth()

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)

  const { value: isOpenAddStudent, setFalse: closeAddStudent, setTrue: openAddStudent } = useBoolean()
  const { value: isOpenConfirm, setFalse: closeConfirm, setTrue: openConfirm } = useBoolean()

  const [page, setPage] = useState(0)

  const coursesInstance = courseKeys.list({ teacherId: profile?.data.id })
  const { data: courses } = useQuery(coursesInstance)

  const studentsInstance = userKeys.list({ courseId: Number(selectedCourse?.id), page, size: 6 })
  const { data: students } = useQuery({ ...studentsInstance, enabled: Boolean(selectedCourse) })

  const handleDelete = () => {}

  const headings = ['Avatar', 'ID', 'Name', 'Email', '']

  useEffect(() => {
    if (courses) {
      setSelectedCourse(courses.content[0])
    }
  }, [courses])

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <BoxContent height='70vh' position='sticky' top={90}>
          <Typography variant='h5'>Your courses</Typography>
          {courses && courses.content.length ? (
            <Stack marginTop={2} height='60vh' sx={{ overflowY: 'scroll' }}>
              {courses.content.map((course) => (
                <Stack
                  key={course.id}
                  direction='row'
                  alignItems='center'
                  sx={{
                    ':hover': {
                      bgcolor: blue[50],
                    },
                    cursor: 'pointer',
                    transition: 'all ease 0.2s',
                  }}
                  bgcolor={selectedCourse?.id === course.id ? blue[50] : 'transparent'}
                  gap={2}
                  padding={2}
                  borderRadius={3}
                  onClick={() => setSelectedCourse(course)}
                >
                  <Stack>
                    <Typography fontWeight={500}>{course.courseName}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Box display='flex' alignItems='center' minHeight='60vh'>
              <NoData title='No topic' />
            </Box>
          )}
        </BoxContent>
      </Grid>
      <Grid item xs={8}>
        <BoxContent height='70vh'>
          <Button sx={{ display: 'flex', gap: 1 }} onClick={openAddStudent}>
            <AddOutlined />
            Add student
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                {headings.map((heading, index) => (
                  <TableCell align={index === headings.length - 1 ? 'right' : 'left'} key={heading}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students?.content.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Avatar src={student.avatarPath} />
                  </TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedStudent(student.id)
                        openConfirm()
                      }}
                    >
                      <DeleteOutline color='error' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={page + 1}
            count={students?.totalPages}
            onChange={(_, page) => setPage(page - 1)}
            sx={{ mt: 2 }}
          />
        </BoxContent>
      </Grid>
      {selectedCourse && (
        <ModalAddStudentToCourse isOpen={isOpenAddStudent} onClose={closeAddStudent} courseId={selectedCourse.id} />
      )}
      {selectedStudent && (
        <ConfirmPopup
          isOpen={isOpenConfirm}
          title='Confirm delete'
          subtitle='Are you sure to delete this student from course?'
          onClose={closeConfirm}
          onAccept={handleDelete}
        />
      )}
    </Grid>
  )
}
