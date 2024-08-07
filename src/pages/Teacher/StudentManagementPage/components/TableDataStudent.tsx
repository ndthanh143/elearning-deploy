import { ConfirmPopup, Flex, Loading, NoData } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { courseKeys } from '@/services/course/course.query'
import { gray, primary } from '@/styles/theme'
import { AddOutlined, DeleteOutline } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { ModalAddStudentToCourse } from '.'
import { coursesRegistrationKeys } from '@/services/coursesRegistration/coursesRegistration.query'

const Progress = ({ totalUnit, totalUnitDone }: { totalUnit: number; totalUnitDone: number }) => {
  const isFinished = totalUnit > 0 && totalUnitDone === totalUnit
  return (
    <Stack>
      <Flex justifyContent='space-between'>
        <Chip
          label={isFinished ? 'Completed' : 'In progress'}
          size='small'
          color={isFinished ? 'success' : 'primary'}
        />
        <Typography fontWeight={500} variant='body2'>
          {((totalUnitDone / totalUnit) * 100).toFixed(0)}%
        </Typography>
      </Flex>
      <Slider
        value={(totalUnitDone / totalUnit) * 100}
        color={totalUnitDone / totalUnit === 1 ? 'success' : 'primary'}
        sx={{
          py: 1,
          '& .MuiSlider-thumb': {
            display: 'none',
          },
        }}
      />
    </Stack>
  )
}

const PAGE_SIZE = 5
export function TableDataStudent() {
  const { profile } = useAuth()

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const { value: isOpenAddStudent, setFalse: closeAddStudent, setTrue: openAddStudent } = useBoolean()

  const [page, setPage] = useState(0)

  const coursesInstance = courseKeys.list({ teacherId: profile?.data.id })
  const { data: courses } = useQuery(coursesInstance)

  const studentsInstance = coursesRegistrationKeys.myStudent({
    courseId: Number(selectedCourseId),
    page,
    size: PAGE_SIZE,
  })
  const {
    data: students,
    isFetched: isFetchedStudents,
    isFetching: isLoadingStudents,
  } = useQuery({
    ...studentsInstance,
    enabled: Boolean(selectedCourseId),
  })

  const handleDelete = () => {}

  const headings = ['No', 'Student', 'Progress', 'Join date', 'Actions']

  const toggleRow = (id: number) => {
    const newSelectedRows = new Set(selectedRows)
    if (selectedRows.has(id)) {
      newSelectedRows.delete(id)
    } else {
      newSelectedRows.add(id)
    }
    setSelectedRows(newSelectedRows)
  }

  useEffect(() => {
    if (courses) {
      setSelectedCourseId(courses.content?.[0]?.id)
    }
  }, [courses])

  return (
    <>
      <Stack>
        <Flex justifyContent='space-between' mb={1} alignItems='center'>
          <Typography variant='body1' fontWeight={700}>
            List students ({students?.totalElements || 0})
          </Typography>
          <Flex gap={2}>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              size='small'
              variant='standard'
              value={selectedCourseId}
              onChange={(course) => {
                setPage(0)
                setSelectedCourseId(Number(course.target.value))
              }}
            >
              {courses?.content.map((course) => (
                <MenuItem value={course.id} key={course.id}>
                  <Typography variant='body1'>{course.courseName}</Typography>
                </MenuItem>
              ))}
            </Select>
            <Button sx={{ display: 'flex', gap: 1 }} onClick={openAddStudent} variant='contained'>
              <AddOutlined />
              Add student
            </Button>
          </Flex>
        </Flex>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: primary[700], color: 'primary.contrastText' }}>
              <TableRow>
                {headings.map((heading) => (
                  <TableCell key={heading} sx={{ color: 'primary.contrastText' }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingStudents || !isFetchedStudents ? (
                <TableRow>
                  <TableCell colSpan={headings.length + 1}>
                    <Flex minHeight={250}>
                      <Loading />
                    </Flex>
                  </TableCell>
                </TableRow>
              ) : !!students?.content.length ? (
                students?.content.map((student, index) => (
                  <TableRow
                    key={student.studentId}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: gray[50],
                      },
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                    }}
                    onClick={() => toggleRow(student.studentId)}
                  >
                    <TableCell>
                      <Typography variant='body1'>{index + 1 + page * PAGE_SIZE}</Typography>
                    </TableCell>
                    <TableCell>
                      <Flex alignItems='center' gap={2}>
                        <Avatar src={student.avatarPath} sizes='small'>
                          {student.fullName.charAt(0)}
                        </Avatar>
                        <Stack>
                          <Typography>{student.fullName}</Typography>
                          <Typography variant='body2'>{student.email}</Typography>
                        </Stack>
                      </Flex>
                    </TableCell>
                    <TableCell>
                      <Progress totalUnit={student.totalUnit} totalUnitDone={student.totalUnitDone} />
                    </TableCell>
                    <TableCell>{dayjs(student.joinDate).format('LLL')}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedStudent(student.studentId)
                        }}
                      >
                        <DeleteOutline color='error' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headings.length + 1}>
                    <Flex minHeight={250}>
                      <NoData title='There is no student in this course' />
                    </Flex>
                  </TableCell>
                </TableRow>
              )}
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
      {selectedCourseId && (
        <ModalAddStudentToCourse isOpen={isOpenAddStudent} onClose={closeAddStudent} courseId={selectedCourseId} />
      )}
      {!!selectedStudent && (
        <ConfirmPopup
          isOpen={!!selectedStudent}
          title='Remove student'
          subtitle='Are you sure to delete this student from course? this action cannot be revert'
          onClose={() => setSelectedStudent(null)}
          onAccept={handleDelete}
          type='delete'
        />
      )}
    </>
  )
}
