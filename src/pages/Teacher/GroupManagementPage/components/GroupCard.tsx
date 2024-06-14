import { ConfirmPopup, CustomMenu, Flex } from '@/components'
import { useAlert, useAuth, useBoolean, useMenu } from '@/hooks'
import { gray, primary } from '@/styles/theme'
import { AddRounded, DeleteRounded, EditRounded, MoreVertRounded } from '@mui/icons-material'
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Button as MuiButton,
  Stack,
  Typography,
} from '@mui/material'
import { ModalAddTask, TaskCard, StudentCard } from '.'
import { icons } from '@/assets/icons'
import { GetGroupListQuery, GetListGroupResponse, Group, TaskInfo } from '@/services/group/dto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupTaskService, taskService } from '@/services'
import { object, string } from 'yup'
import { UseFormReturn, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { groupKeys } from '@/services/group/query'

interface GroupCardProps {
  size: number
  state: 'member' | 'task'
  data: Group
  onUpdate?: () => void
  onDelete?: () => void
  queryKey?: (GetGroupListQuery | 'list' | 'group')[]
}

export type FormTaskModal = UseFormReturn<
  {
    name: string
    description: string
    startDate: string
    endDate: string
  },
  any,
  undefined
>

const taskSchema = object({
  name: string().required('Task name is required'),
  description: string().required('Task description is required'),
  startDate: string().required('Start date is required'),
  endDate: string().required('End date is required'),
})

export const GroupCard = ({
  state = 'member',
  queryKey,
  data,
  onUpdate = () => {},
  onDelete = () => {},
}: GroupCardProps) => {
  const { isTeacher } = useAuth()
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const { anchorEl, onClose, isOpen, onOpen } = useMenu()
  const { value: isOpenAddTask, setTrue: openAddTask, setFalse: closeAddTask } = useBoolean()
  const [selectedDeleteTask, setSelectedDeleteTask] = useState<number | null>(null)
  const [selectedEditTask, setSelectedEditTask] = useState<TaskInfo | null>(null)

  const form = useForm({ resolver: yupResolver(taskSchema) })

  const handleRemoveStudent = (index: number) => () => {
    triggerAlert(`Remove student at ${index}`)
  }

  const { mutate: mutateGrantTask } = useMutation({
    mutationFn: groupTaskService.create,
    onSuccess: (payload) => {
      if (queryKey) {
        queryClient.setQueryData(queryKey, (old: GetListGroupResponse['data']) => {
          const newTaskInfo: TaskInfo = {
            id: payload.taskInfo.id,
            description: payload.taskInfo.description,
            endDate: payload.endDate,
            startDate: payload.startDate,
            name: payload.taskInfo.name,
            groupId: payload.groupInfo.id,
            groupName: payload.groupInfo.name,
          }

          return {
            ...old,
            content: old.content.map((group) => {
              if (group.id === data.id) {
                return {
                  ...group,
                  taskInfo: [...group.taskInfo, newTaskInfo],
                }
              }
              return group
            }),
          }
        })
      }
      triggerAlert('Create task successfully', 'success'), closeAddTask()
    },
    onError: () => {
      triggerAlert('Create task failed', 'error')
    },
  })

  const { mutate: mutateUpdateGrantTask } = useMutation({
    mutationFn: taskService.changeTimeTaskForGroup,
  })

  const { mutate: mutateCreateTask, isPending: isPendingCreateTask } = useMutation({
    mutationFn: taskService.create,
    onSuccess: (payload) => {
      triggerAlert('Create task successfully', 'success')
      closeAddTask()

      mutateGrantTask({
        endDate: new Date(form.getValues('endDate')).toISOString(),
        groupId: data.id,
        startDate: new Date(form.getValues('startDate')).toISOString(),
        taskId: payload.id,
      })
    },

    onError: () => {
      triggerAlert('Create task failed', 'error')
    },
  })

  const { mutate: mutateUpdateTask } = useMutation({
    mutationFn: taskService.update,
  })

  const { mutate: mutateRemoveTaskfromGroup, isPending: isPendingRemoveTaskfromGroup } = useMutation({
    mutationFn: taskService.removeTaskFromGroup,
    onSuccess: () => {
      if (queryKey) {
        queryClient.setQueryData(queryKey, (old: GetListGroupResponse['data']) => {
          return {
            ...old,
            content: old.content.map((group) => {
              if (group.id === data.id) {
                return {
                  ...group,
                  taskInfo: group.taskInfo.filter((task) => task.id !== selectedDeleteTask),
                }
              }
              return group
            }),
          }
        })
      }
      setSelectedDeleteTask(null)
      triggerAlert('Delete task successfully', 'success')
    },

    onError: () => {
      triggerAlert('Delete task failed', 'error')
    },
  })

  const moveTask = (fromIndex: number, toIndex: number) => {
    // const updatedTasks = [...tasks]
    // const [movedTask] = updatedTasks.splice(fromIndex, 1)
    // updatedTasks.splice(toIndex, 0, movedTask)
    // setTasks(updatedTasks)
    console.log(fromIndex, toIndex)
  }

  const handleCreateTask = async (payload: {
    name: string
    description: string
    startDate: string
    endDate: string
  }) => {
    if (selectedEditTask) {
      const updateTaskPromises = [
        payload.endDate || payload.startDate
          ? mutateUpdateGrantTask({
              groupId: data.id,
              taskId: selectedEditTask.id,
              endDate: new Date(payload.endDate).toISOString(),
              startDate: new Date(payload.startDate).toISOString(),
            })
          : Promise.resolve(),
        payload.name || payload.description
          ? mutateUpdateTask({ id: selectedEditTask.id, name: payload.name, description: payload.description })
          : Promise.resolve(),
      ]
      await Promise.all(updateTaskPromises)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
          setSelectedEditTask(null)
          triggerAlert('Update task successfully', 'success')
        })
        .catch(() => {
          triggerAlert('Update task failed', 'error')
        })
    } else {
      mutateCreateTask({ name: payload.name, description: payload.description })
    }
  }

  const totalMemberGroup = data.studentInfo.length
  const restMember = data.size - totalMemberGroup

  const handleUpdateTask = (task: TaskInfo) => () => {
    form.setValue('name', task.name)
    form.setValue('description', task.description)
    form.setValue('startDate', task.startDate)
    form.setValue('endDate', task.endDate)

    setSelectedEditTask(task)
  }

  const handleCloseModalTask = () => {
    if (selectedEditTask) {
      setSelectedEditTask(null)
    } else {
      closeAddTask()
    }
  }

  const handleDeleteTask = () => {
    if (selectedDeleteTask) {
      mutateRemoveTaskfromGroup({ groupId: data.id, taskId: selectedDeleteTask })
    }
  }

  const renderMembers = () => {
    return (
      <>
        {data.studentInfo.map((student, index) => (
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
            <StudentCard data={student} />
            {isTeacher && (
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
            )}
          </Flex>
        ))}
        {Array(restMember)
          .fill(true)
          .map((_, index) => (
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
          ))}
      </>
    )
  }

  const renderTasks = () => {
    return data.taskInfo.length > 0 ? (
      data.taskInfo.map((task, index) => (
        <TaskCard
          key={task.id}
          data={task}
          moveTask={moveTask}
          index={index}
          onUpdate={handleUpdateTask(task)}
          onDelete={() => setSelectedDeleteTask(task.id)}
        />
      ))
    ) : (
      <Stack minHeight={300} justifyContent='center' alignItems='center' gap={2}>
        {icons['noData']}
        <Typography variant='body2' color={gray[500]}>
          There is no task in this group
        </Typography>
      </Stack>
    )
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
                  {data.name}
                </Typography>
              </Flex>
            </Flex>
            {isTeacher && (
              <Flex gap={1}>
                {state === 'member' ? (
                  <IconButton onClick={onOpen}>
                    <MoreVertRounded fontSize='small' />
                  </IconButton>
                ) : (
                  <MuiButton startIcon={<AddRounded fontSize='small' />} size='small' onClick={openAddTask}>
                    Add task
                  </MuiButton>
                )}
              </Flex>
            )}
          </Flex>
          <Divider sx={{ my: 2 }} />
          <Stack gap={2}>{state === 'member' ? renderMembers() : renderTasks()}</Stack>
        </CardContent>
      </Card>
      <ModalAddTask
        isOpen={isOpenAddTask || !!selectedEditTask}
        onClose={handleCloseModalTask}
        onSubmit={handleCreateTask}
        form={form}
        status={selectedEditTask ? 'edit' : 'create'}
        loading={isPendingCreateTask}
      />
      <CustomMenu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
        <MenuItem
          onClick={() => {
            onClose()
            onUpdate()
          }}
        >
          <ListItemIcon>
            <EditRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Update</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClose()
            onDelete()
          }}
        >
          <ListItemIcon>
            <DeleteRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Delete</Typography>
        </MenuItem>
      </CustomMenu>
      <ConfirmPopup
        title='Remove Task'
        subtitle='Are you sure to remove this task?'
        type='delete'
        isOpen={!!selectedDeleteTask}
        onClose={() => setSelectedDeleteTask(null)}
        onAccept={handleDeleteTask}
        isLoading={isPendingRemoveTaskfromGroup}
      />
    </>
  )
}
