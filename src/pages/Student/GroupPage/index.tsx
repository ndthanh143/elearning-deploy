import { Button, CustomSelect, Flex } from '@/components'
import { useAlert, useBoolean } from '@/hooks'
import { primary } from '@/styles/theme'
import { AddRounded, AutoModeRounded, MoreVertRounded } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Button as MuiButton,
  Stack,
  Typography,
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { useDrag, useDrop, DndProvider, DragSourceMonitor } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ModalAddTask } from './components'
import { courseKeys } from '@/services/course/course.query'
import { useQuery } from '@tanstack/react-query'
import { icons } from '@/assets/icons'

const ronaldoImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcgCaW2c1ugKTOqZA1jKxvPoVoT5kGuQPvOg&s'

export const StudentCard: React.FC = () => {
  return (
    <Flex gap={1} sx={{ bgcolor: primary[50], borderRadius: 3, p: 1, width: '100%' }}>
      <Avatar src={ronaldoImg} sx={{ width: 40, height: 40 }}>
        N
      </Avatar>
      <Stack gap={0}>
        <Typography variant='body2' fontWeight={700}>
          Cristiano Ronaldo
        </Typography>
        <Typography variant='body2' textOverflow='ellipsis'>
          ronaldo.cristiano@gmail.com
        </Typography>
      </Stack>
    </Flex>
  )
}

const ListStudent: React.FC = () => {
  return (
    <Stack gap={1}>
      {Array(10)
        .fill(true)
        .map((item, index) => (
          <StudentCard key={index} />
        ))}
    </Stack>
  )
}

const AddGroup: React.FC = () => {
  return (
    <Card variant='outlined' sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Flex justifyContent='center' alignItems='center' height='100%'>
          <Button startIcon={<AddRounded />} fullWidth sx={{ py: 2 }}>
            Add new group
          </Button>
        </Flex>
      </CardContent>
    </Card>
  )
}

interface TaskCardProps {
  task: Task
  index: number
  moveTask: (fromIndex: number, toIndex: number) => void
}

interface Task {
  title: string
  description: string
  startDate: string
  deadline: string
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, moveTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  return (
    <Stack
      ref={(node) => drag(drop(node))}
      gap={1}
      p={2}
      borderRadius={3}
      bgcolor={primary[50]}
      sx={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Flex justifyContent='space-between'>
        <Typography variant='body2' fontWeight={700}>
          {task.title}
        </Typography>
        <IconButton>
          <MoreVertRounded fontSize='small' />
        </IconButton>
      </Flex>
      <Box display='flex'>
        <Typography variant='body2'>{task.description}</Typography>
      </Box>
      <Flex justifyContent='end' mt={2}>
        <Stack gap={1}>
          <Flex gap={1}>
            {icons['calendar']}
            <Typography variant='body2' fontWeight={600}>
              {task.startDate}
            </Typography>
          </Flex>
          <Flex gap={1}>
            {icons['deadline']}
            <Typography variant='body2' fontWeight={600}>
              {task.deadline}
            </Typography>
          </Flex>
        </Stack>
      </Flex>
    </Stack>
  )
}

interface GroupCardProps {
  size: number
  state: 'member' | 'task'
}

const GroupCard: React.FC<GroupCardProps> = ({ size, state = 'member' }) => {
  const { triggerAlert } = useAlert()
  const { value: isOpenAddTask, setTrue: openAddTask, setFalse: closeAddTask } = useBoolean()

  const [tasks, setTasks] = useState<Task[]>([
    {
      title: 'Task 1',
      description: 'Description of task 1',
      startDate: 'May 20th, 10:04 PM',
      deadline: 'May 20th, 11:04 PM',
    },
    {
      title: 'Task 2',
      description: 'Description of task 2',
      startDate: 'May 20th, 10:04 PM',
      deadline: 'May 21st, 11:04 PM',
    },
    {
      title: 'Task 3',
      description: 'Description of task 3',
      startDate: 'May 20th, 10:04 PM',
      deadline: 'May 22nd, 11:04 PM',
    },
    {
      title: 'Task 4',
      description: 'Description of task 4',
      startDate: 'May 20th, 10:04 PM',
      deadline: 'May 22nd, 11:04 PM',
    },
  ])

  const handleRemoveStudent = (index: number) => () => {
    triggerAlert('Remove student at index')
  }

  const moveTask = (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...tasks]
    const [movedTask] = updatedTasks.splice(fromIndex, 1)
    updatedTasks.splice(toIndex, 0, movedTask)
    setTasks(updatedTasks)
  }

  return (
    <>
      <Card variant='outlined'>
        <CardContent>
          <Flex justifyContent='space-between'>
            <Flex justifyContent='space-between'>
              <Flex gap={1}>
                {icons['group']}
                <Typography variant='body2' fontWeight={700}>
                  Group 1
                </Typography>
              </Flex>
            </Flex>
            <Flex gap={1}>
              {state === 'member' ? (
                <Typography variant='body2'>
                  Current: <b>{size}</b>
                </Typography>
              ) : (
                <MuiButton startIcon={<AddRounded fontSize='small' />} size='small' onClick={openAddTask}>
                  Add task
                </MuiButton>
              )}
            </Flex>
          </Flex>
          <Divider sx={{ my: 2 }} />
          <Stack gap={2}>
            {Array(size)
              .fill(true)
              .map((_, index) =>
                state === 'member' ? (
                  index < 3 ? (
                    <Flex
                      key={index}
                      border={1}
                      borderRadius={3}
                      p={1}
                      borderColor='#ededed'
                      minHeight={50}
                      justifyContent='center'
                      position='relative'
                    >
                      <StudentCard />
                      <Flex
                        bgcolor='primary.main'
                        position='absolute'
                        height={20}
                        width={20}
                        borderRadius='100%'
                        justifyContent='center'
                        color='white'
                        right={-8}
                        top={-8}
                        sx={{
                          cursor: 'pointer',
                          ':hover': {
                            bgcolor: primary[600],
                          },
                          ':focus': {
                            bgcolor: primary[700],
                          },
                          userSelect: 'none',
                        }}
                        onClick={handleRemoveStudent(index)}
                      >
                        -
                      </Flex>
                    </Flex>
                  ) : (
                    <Flex
                      key={index}
                      border={1}
                      borderRadius={3}
                      p={1}
                      borderColor='#ededed'
                      minHeight={50}
                      justifyContent='center'
                      sx={{
                        ':hover': {
                          bgcolor: primary[50],
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <AddRounded color='primary' />
                    </Flex>
                  )
                ) : (
                  <TaskCard key={index} task={tasks[index]} index={index} moveTask={moveTask} />
                ),
              )}
          </Stack>
        </CardContent>
      </Card>
      <ModalAddTask isOpen={isOpenAddTask} onClose={closeAddTask} />
    </>
  )
}

export const GroupPage: React.FC = () => {
  const [state, setState] = useState<'member' | 'task'>('member')

  const handleChangeState = (state: 'member' | 'task') => () => {
    setState(state)
  }

  const [selectedCourseId, setSelectedCourseId] = useState<number>()

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
    <DndProvider backend={HTML5Backend}>
      <Container>
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
            <Grid container spacing={2}>
              {Array(6)
                .fill(true)
                .map((_, index) => (
                  <Fragment key={index}>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                      <GroupCard size={4} state={state} />
                    </Grid>
                    {index === 5 && (
                      <Grid item xs={12} sm={6} md={6} lg={3}>
                        <AddGroup />
                      </Grid>
                    )}
                  </Fragment>
                ))}
            </Grid>
            {false && (
              <Flex height='100%' justifyContent='center' alignItems='center' minHeight='60vh'>
                <Stack gap={2} alignItems='center'>
                  {icons['noData']}
                  <MuiButton startIcon={<AddRounded />}>Create New Group</MuiButton>
                  <Divider>Or</Divider>
                  <Button startIcon={<AutoModeRounded />}>Auto Generate Group</Button>
                </Stack>
              </Flex>
            )}
          </CardContent>
        </Card>
      </Container>
    </DndProvider>
  )
}
