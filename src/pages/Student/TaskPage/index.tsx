import { icons } from '@/assets/icons'
import { ConfirmPopup, CustomModal, CustomSelect, Dropzone, Flex, IconContainer } from '@/components'
import { useBoolean } from '@/hooks'
import { courseKeys } from '@/services/course/course.query'
import { gray, primary } from '@/styles/theme'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { groupKeys } from '@/services/group/query'
import { GroupCard } from '@/pages/Teacher/GroupManagementPage/components'
import { taskKeys } from '@/services/task/query'
import { Task } from '@/services/task/dto'

const ListMembers = () => {
  return <Stack gap={2}></Stack>
}

const TaskStatus = ({ status }: { status: 'done' | 'undone' }) => {
  return (
    <Chip
      label={status === 'done' ? 'Done' : 'Undone'}
      color={status === 'done' ? 'success' : 'primary'}
      variant={status === 'done' ? 'filled' : 'outlined'}
    />
  )
}

const TaskCard = ({ data }: { data: Task }) => {
  return (
    <Badge
      badgeContent={'1'}
      color='primary'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        width: '100%',
      }}
    >
      <Card
        variant='outlined'
        sx={{
          ':hover': {
            filter: `drop-shadow(0 0 0.2rem ${primary[200]})`,
            cursor: 'pointer',
          },
          transition: 'all 0.15s ease-in-out',
          width: '100%',
        }}
      >
        <CardContent>
          <Flex justifyContent='space-between'>
            <Flex gap={1}>
              <Box width={20} height={20}>
                {icons['task']}
              </Box>
              <Typography fontWeight={700} variant='body2'>
                {data.name}
              </Typography>
            </Flex>
            <TaskStatus status='done' />
          </Flex>
          <Divider sx={{ my: 2 }} />
          <Stack gap={0.5}>
            {icons['description']}
            <Typography variant='body2'>{data.description}</Typography>
          </Stack>
          <Stack gap={1} mt={2}>
            <Flex gap={2}>
              {icons['calendar']}
              <Typography variant='body2' fontWeight={700}>
                12/12/2021 11:59 PM
              </Typography>
            </Flex>
            <Flex gap={2}>
              {icons['deadline']}
              <Typography variant='body2' fontWeight={700}>
                12/22/2021 11:59 PM
              </Typography>
            </Flex>
          </Stack>
        </CardContent>
      </Card>
    </Badge>
  )
}

interface ITaskDetailProps {
  isOpen: boolean
  onClose: () => void
  data: Task
}

const TaskDetail = ({ isOpen, onClose, data }: ITaskDetailProps) => {
  const [file, setFile] = useState<File | null>(null)
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean(false)

  const handleDownloadFile = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleRemoveAnswer = () => {
    setFile(null)
    closeConfirm()
  }

  return (
    <>
      <CustomModal title='Task details' isOpen={isOpen} sx={{ maxWidth: 800 }} onClose={onClose}>
        <Divider sx={{ my: 2 }} />
        <Flex justifyContent='space-between'>
          <Flex gap={1}>
            <Box width={20} height={20}>
              {icons['task']}
            </Box>
            <Typography fontWeight={700} variant='body2'>
              {data.name}
            </Typography>
          </Flex>
        </Flex>
        <Stack gap={2}>
          <Stack gap={1} mt={2}>
            <Flex gap={2}>
              {icons['calendar']}
              <Typography variant='body2' fontWeight={700}>
                12/12/2021 11:59 PM
              </Typography>
            </Flex>
            <Flex gap={2}>
              {icons['deadline']}
              <Typography variant='body2' fontWeight={700}>
                12/22/2021 11:59 PM
              </Typography>
            </Flex>
          </Stack>
        </Stack>
        <Stack gap={0.5} mt={2}>
          <Typography variant='body2'>{data.description}</Typography>
        </Stack>
        <Stack mt={2} gap={1}>
          <Flex gap={1}>
            {icons['resource']}
            <Typography variant='body2' fontWeight={700}>
              {file ? 'Your answer' : 'Upload your answer'}
            </Typography>
          </Flex>
          {!file && <Dropzone onFileChange={setFile} />}
          {file && (
            <Stack gap={2}>
              <Box
                border={1}
                borderRadius={3}
                borderColor={'#ededed'}
                px={2}
                py={2}
                sx={{ cursor: 'pointer' }}
                onClick={handleDownloadFile}
              >
                <Flex gap={1}>
                  <IconContainer isActive color='primary'>
                    {icons['resource']}
                  </IconContainer>
                  <Stack>
                    <Typography variant='body2' fontWeight={700}>
                      {file.name}
                    </Typography>
                    <Typography variant='body2' color={gray[400]}>
                      {(file.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Stack>
                  <Chip
                    label='Remove'
                    onClick={(e) => {
                      e.stopPropagation()
                      openConfirm()
                    }}
                    sx={{ ml: 'auto', bgcolor: primary[500], color: primary[50] }}
                  />
                </Flex>
              </Box>
              <Typography variant='body2' fontWeight={700}>
                Uploader
              </Typography>
              <Flex gap={1}>
                <Avatar src='https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTbyNyLxq6CsGjR7nhyJs0oRhnTSW0SUNYWnMnC-JSExpKha0bac6xzTufwCzAoqLed4J0zztdsnd0wy6U'>
                  R
                </Avatar>
                <Stack>
                  <Typography fontWeight={700} variant='body2'>
                    Cristiano Ronaldo
                  </Typography>
                  <Typography variant='body2' color={gray[400]}>
                    ronaldo.cristiano@gmail.com
                  </Typography>
                </Stack>
              </Flex>
            </Stack>
          )}
          <Flex justifyContent='end' mt={2} gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant='contained'>Save</Button>
          </Flex>
        </Stack>
      </CustomModal>
      <ConfirmPopup
        isOpen={isOpenConfirm}
        onClose={closeConfirm}
        onAccept={handleRemoveAnswer}
        title='Remove Answer'
        type='delete'
        subtitle='Are you sure to remove your answer, everyone in group will be notified about this!'
      />
    </>
  )
}

export function TaskPage() {
  const [state, setState] = useState<'member' | 'task'>('member')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleChangeState = (state: 'member' | 'task') => () => {
    setState(state)
  }

  const [selectedCourseId, setSelectedCourseId] = useState<number>()

  const groupInstance = groupKeys.list({ courseId: Number(selectedCourseId) })
  const { data: groups } = useQuery({
    ...groupInstance,
    enabled: Boolean(selectedCourseId),
  })

  const taskInstance = taskKeys.list()
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
                            <GroupCard size={4} state={'member'} data={group} />
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
                            <TaskCard key={index} data={task} />
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
