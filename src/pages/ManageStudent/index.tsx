import { ConfirmPopup, Flex, Loading, NoData } from '@/components'
import { ModalAddStudentToCourse } from '@/components/ModalAddStudentToCourse'
import { useAuth, useBoolean } from '@/hooks'
import { courseKeys } from '@/services/course/course.query'
import { userKeys } from '@/services/user/user.query'
import { gray } from '@/styles/theme'
import { AddOutlined, DeleteOutline } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const ManageStudent = () => {
  const { profile } = useAuth()

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)

  const { value: isOpenAddStudent, setFalse: closeAddStudent, setTrue: openAddStudent } = useBoolean()
  const { value: isOpenConfirm, setFalse: closeConfirm, setTrue: openConfirm } = useBoolean()

  const [page, setPage] = useState(0)

  const coursesInstance = courseKeys.list({ teacherId: profile?.data.id })
  const { data: courses } = useQuery(coursesInstance)

  const studentsInstance = userKeys.list({ courseId: Number(selectedCourseId), page, size: 6 })
  const {
    data: students,
    isFetching: isLoadingStudents,
    isFetched: isFetchedStudents,
  } = useQuery({ ...studentsInstance, enabled: Boolean(selectedCourseId) })

  const handleDelete = () => {}

  const headings = ['Avatar', 'ID', 'Name', 'Email', '']

  useEffect(() => {
    if (courses) {
      setSelectedCourseId(courses.content[0].id)
    }
  }, [courses])

  return (
    <>
      <Container sx={{ my: 2 }}>
        <Stack gap={2}>
          <Flex justifyContent='space-between'>
            <Button sx={{ display: 'flex', gap: 1 }} onClick={openAddStudent}>
              <AddOutlined />
              Add student
            </Button>
            <Flex>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  // value={age}
                  size='small'
                  value={selectedCourseId}
                  onChange={(course) => setSelectedCourseId(Number(course.target.value))}
                >
                  {courses?.content.map((course) => (
                    <MenuItem value={course.id} key={course.id}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </Flex>
          <Stack>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  <TableRow>
                    {headings.map((heading, index) => (
                      <TableCell
                        align={index === headings.length - 1 ? 'right' : 'left'}
                        key={heading}
                        sx={{ color: 'primary.contrastText' }}
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {isLoadingStudents && <Loading />}
                <TableBody>
                  {isFetchedStudents &&
                    (students?.content.length ? (
                      students?.content.map((student) => (
                        <TableRow
                          key={student.id}
                          sx={{
                            '&:nth-of-type(odd)': {
                              backgroundColor: gray[50],
                            },
                            // hide last border
                            '&:last-child td, &:last-child th': {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell>
                            <Avatar src={student.avatarPath}>{student.fullName.charAt(0)}</Avatar>
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
                      ))
                    ) : (
                      <Flex justifyContent='center' alignItems='center' width='100%'>
                        <NoData />
                      </Flex>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {students && students.totalPages > 1 && (
              <Pagination
                page={page + 1}
                count={students?.totalPages}
                onChange={(_, page) => setPage(page - 1)}
                sx={{ mt: 2, mx: 'auto' }}
              />
            )}
          </Stack>
        </Stack>
      </Container>

      {selectedCourseId && (
        <ModalAddStudentToCourse isOpen={isOpenAddStudent} onClose={closeAddStudent} courseId={selectedCourseId} />
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
    </>
  )
}
