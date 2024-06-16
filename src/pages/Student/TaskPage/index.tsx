import { icons } from '@/assets/icons'
import { CustomSelect, Flex } from '@/components'
import { courseKeys } from '@/services/course/course.query'
import { gray } from '@/styles/theme'
import { Box, Card, CardContent, Chip, Container, Divider, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { groupKeys } from '@/services/group/query'
import { GroupCard } from '@/pages/Teacher/GroupManagementPage/components'
import { groupTaskKeys } from '@/services/groupTask/query'
import { GroupTask } from '@/services/groupTask/dto'
import { TaskCardStudent, TaskDetail } from './components'

const ListMembers = () => {
  return <Stack gap={2}></Stack>
}

export function TaskPage() {
  const [state, setState] = useState<'member' | 'task'>('member')
  const [selectedTask, setSelectedTask] = useState<GroupTask | null>(null)

  const handleChangeState = (state: 'member' | 'task') => () => {
    setState(state)
  }

  const [selectedCourseId, setSelectedCourseId] = useState<number>()

  const groupInstance = groupKeys.list({ courseId: Number(selectedCourseId) })
  const { data: groups } = useQuery({
    ...groupInstance,
    enabled: Boolean(selectedCourseId),
  })

  const taskInstance = groupTaskKeys.list()
  const { data: tasks } = useQuery({ ...taskInstance })

  const coursesInstance = courseKeys.list()
  const { data: courses, isFetched } = useQuery({
    ...coursesInstance,
  })

  useEffect(() => {
    if (courses && isFetched && courses.content.length > 0) {
      setSelectedCourseId(courses.content[0].id)
    }
  }, [isFetched, courses])

  return (
    <>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={9}>
            <DndProvider backend={HTML5Backend}>
              <Card>
                <CardContent>
                  <Flex justifyContent='space-between'>
                    <Flex gap={1}>
                      <Chip
                        color='primary'
                        variant={state === 'member' ? 'filled' : 'outlined'}
                        label='Member'
                        onClick={handleChangeState('member')}
                      />
                      <Chip
                        color='primary'
                        variant={state === 'task' ? 'filled' : 'outlined'}
                        label={'Tasks'}
                        onClick={handleChangeState('task')}
                      />
                    </Flex>
                    <CustomSelect
                      data={
                        courses?.content.map((course) => ({
                          label: course.courseName,
                          value: Number(course.id),
                        })) || []
                      }
                      value={Number(selectedCourseId)}
                      onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                      size='small'
                    />
                  </Flex>
                  <Divider sx={{ my: 2 }} />
                  {state === 'member' &&
                    (groups?.content.length ? (
                      <Grid container spacing={2}>
                        {groups?.content.map((group, index) => (
                          <Grid key={index} item xs={12} sm={6} md={6} lg={4}>
                            <GroupCard size={4} state={'member'} data={group} queryKey={groupInstance.queryKey} />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Stack alignItems='center' justifyContent='center' minHeight={'70vh'} gap={4}>
                        {icons['noData']}
                        <Typography variant='body2' color={gray[500]}>
                          There is no group in this course, please contact your teacher to create a group
                        </Typography>
                      </Stack>
                    ))}
                  {state === 'task' &&
                    (tasks?.content.length ? (
                      <Stack gap={4}>
                        {tasks?.content.map((task, index) => (
                          <Box key={task.id} onClick={() => setSelectedTask(task)}>
                            <TaskCardStudent key={index} data={task} />
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Stack alignItems='center' justifyContent='center' minHeight={'70vh'} gap={4}>
                        {icons['noData']}
                        <Typography variant='body2' color={gray[500]}>
                          There is no group in this course, please contact your teacher to create a group
                        </Typography>
                      </Stack>
                    ))}
                </CardContent>
              </Card>
            </DndProvider>
          </Grid>
          <Grid item xs={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography fontWeight={700} variant='body1' textAlign='start' mb={2}>
                  Your groupmates
                </Typography>
                <ListMembers />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {selectedTask && <TaskDetail data={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} />}
    </>
  )
}
