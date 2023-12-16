import { BoxContent, Loading, NoData } from '@/components'
import { useAuth } from '@/hooks'
import { Assignment } from '@/services/assignment/assignment.dto'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { courseKeys } from '@/services/course/course.query'
import { formatDate } from '@/utils'
import { AssignmentOutlined } from '@mui/icons-material'
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const SubmissionManagementPage = () => {
  const { profile } = useAuth()

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  const coursesInstance = courseKeys.list({ teacherId: profile?.data.id })
  const { data: courses } = useQuery({
    ...coursesInstance,
    enabled: Boolean(profile?.data.id),
    select: (data) => data.content,
  })

  const assignmentsInstance = assignmentKeys.list({ courseId: Number(selectedCourse) })
  const { data: assignments } = useQuery({
    ...assignmentsInstance,
    enabled: Boolean(selectedCourse),
    select: (data) => data.content,
  })

  const assignmentSubmissionInstance = assignmentSubmissionKeys.list({
    courseId: Number(selectedCourse),
    assignmentId: selectedAssignment?.id,
  })
  const {
    data: assignmentSubmissions,
    isLoading: isLoadingAssignmentSubmission,
    isFetched: isFetchedAssignmentSubmission,
  } = useQuery({ ...assignmentSubmissionInstance, enabled: Boolean(selectedAssignment) })

  const headings = ['Student', 'Date', 'File', 'Link', 'Text']

  useEffect(() => {
    if (courses) {
      setSelectedCourse(courses[0].id)
    }
  }, [courses])

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <BoxContent height='80vh'>
          <Select
            size='small'
            fullWidth
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value as number)}
            sx={{ borderRadius: 3 }}
          >
            {courses?.map((course) => <MenuItem value={course.id}>{course.courseName}</MenuItem>)}
          </Select>
          {!assignments?.length && (
            <Box display='flex' alignItems='center' height='100%'>
              <NoData title='No assignments' />
            </Box>
          )}
          <List>
            {assignments?.map((assignment) => (
              <ListItem key={assignment.id} onClick={() => setSelectedAssignment(assignment)}>
                <ListItemButton
                  sx={{ bgcolor: assignment === selectedAssignment ? blue[50] : 'inherit', borderRadius: 3 }}
                >
                  <ListItemIcon>
                    <AssignmentOutlined />
                  </ListItemIcon>
                  <ListItemText>{assignment.assignmentTitle}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </BoxContent>
      </Grid>
      <Grid item xs={8}>
        <BoxContent height='80vh'>
          {isLoadingAssignmentSubmission && (
            <Box display='flex' alignItems='center' height='100%'>
              <Loading />
            </Box>
          )}
          {(isFetchedAssignmentSubmission && !assignmentSubmissions?.content.length) ||
          !assignmentSubmissions?.content.length ? (
            <Box display='flex' alignItems='center' height='100%'>
              <NoData title='No data' />
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    {headings.map((item, index) => (
                      <TableCell key={item} align={!index ? 'left' : 'right'}>
                        {item}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignmentSubmissions?.content.map((submission) => (
                    <TableRow>
                      <TableCell>heading 1</TableCell>
                      <TableCell align='right'>{formatDate.toDateTime(new Date(submission.createDate))}</TableCell>
                      <TableCell align='right'>{submission.fileSubmissionUrl}</TableCell>
                      <TableCell align='right'>{submission.textSubmission}</TableCell>
                      <TableCell align='right'>{submission.linkSubmission}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination page={0} count={assignmentSubmissions?.totalPages} />
            </>
          )}
        </BoxContent>
      </Grid>
    </Grid>
  )
}
