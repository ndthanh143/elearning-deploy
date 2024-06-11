import { ConfirmPopup, CustomMenu, Flex } from '@/components'
import { useAlert, useBoolean, useMenu } from '@/hooks'
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
import { ModalAddTask, TaskCard } from '.'
import { icons } from '@/assets/icons'
import { Group, TaskInfo } from '@/services/group/dto'
import { StudentCard } from '..'
import { useMutation } from '@tanstack/react-query'
import { taskService } from '@/services'
import { object, string } from 'yup'
import { UseFormReturn, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'

interface GroupCardProps {
  size: number
  state: 'member' | 'task'
  data: Group
  onUpdate?: () => void
  onDelete?: () => void
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

export const GroupCard = ({ state = 'member', data, onUpdate = () => {}, onDelete = () => {} }: GroupCardProps) => {
  const { triggerAlert } = useAlert()
  const { anchorEl, onClose, isOpen, onOpen } = useMenu()
  const { value: isOpenAddTask, setTrue: openAddTask, setFalse: closeAddTask } = useBoolean()
  const [selectedDeleteTask, setSelectedDeleteTask] = useState<number | null>(null)
  const [selectedEditTask, setSelectedEditTask] = useState<TaskInfo | null>(null)

  const form = useForm({ resolver: yupResolver(taskSchema) })

  const handleRemoveStudent = (index: number) => () => {
    triggerAlert(`Remove student at ${index}`)
  }

  const { mutate: mutateCreateTask, isPending: isPendingCreateTask } = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      triggerAlert('Create task successfully', 'success')
      closeAddTask()
    },

    onError: () => {
      triggerAlert('Create task failed', 'error')
    },
  })

  const { mutate: mutateDeleteTask, isPending: isPendingDeleteTask } = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
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

  const handleCreateTask = (payload: { name: string; description: string; startDate: string; endDate: string }) => {
    console.log(payload)
    if (selectedEditTask) {
      handleUpdateTask()
    } else {
      mutateCreateTask({ name: payload.name, description: payload.description })
    }
  }

  const totalMemberGroup = data.studentInfo.length
  const restMember = data.size - totalMemberGroup

  const handleUpdateTask = () => {
    if (selectedEditTask) {
      //   mutateUpdateTask(selectedEditTask)
    }
  }

  const handleDeleteTask = () => {
    if (selectedDeleteTask) {
      mutateDeleteTask(selectedDeleteTask)
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
          onUpdate={() => setSelectedEditTask(task)}
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
          </Flex>
          <Divider sx={{ my: 2 }} />
          <Stack gap={2}>{state === 'member' ? renderMembers() : renderTasks()}</Stack>
        </CardContent>
      </Card>
      <ModalAddTask
        isOpen={isOpenAddTask}
        onClose={closeAddTask}
        onSubmit={handleCreateTask}
        form={form}
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
        subtitle='Are'
        isOpen={!!selectedDeleteTask}
        onClose={() => setSelectedDeleteTask(null)}
        onAccept={handleDeleteTask}
        isLoading={isPendingDeleteTask}
      />
    </>
  )
}
