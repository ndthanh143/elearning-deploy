import { ConfirmPopup, CustomMenu, CustomTooltip, Flex, LoadingButton } from '@/components'
import { useAlert, useAuth, useBoolean, useMenu } from '@/hooks'
import { blue, gray, primary } from '@/styles/theme'
import {
  AddRounded,
  DeleteRounded,
  EditRounded,
  LockOpenRounded,
  LockRounded,
  LogoutRounded,
  MoreVertRounded,
} from '@mui/icons-material'
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
import { ModalActionsTask, TaskCard, StudentCard } from '.'
import { icons } from '@/assets/icons'
import { GetGroupListQuery, GetListGroupResponse, Group, GroupTaskInfo } from '@/services/group/dto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupService, groupTaskService, taskService } from '@/services'
import { object, string } from 'yup'
import { UseFormReturn, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { groupKeys } from '@/services/group/query'
import { red } from '@mui/material/colors'

interface GroupCardProps {
  size: number
  state: 'member' | 'task'
  data: Group
  onUpdate?: () => void
  onDelete?: () => void
  onAddStudent?: () => void
  disabled?: boolean
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
  disabled,
  onUpdate = () => {},
  onDelete = () => {},
  onAddStudent = () => {},
}: GroupCardProps) => {
  const { isTeacher, isStudent, profile } = useAuth()
  const { triggerAlert } = useAlert()
  const queryClient = useQueryClient()
  const { anchorEl, onClose, isOpen, onOpen } = useMenu()
  const { value: isOpenAddTask, setTrue: openAddTask, setFalse: closeAddTask } = useBoolean()
  const [selectedDeleteTask, setSelectedDeleteTask] = useState<number | null>(null)
  const [selectedEditTask, setSelectedEditTask] = useState<GroupTaskInfo | null>(null)

  const form = useForm({ resolver: yupResolver(taskSchema) })

  const isStudentExistIngroup = data.studentInfo.some((student) => student.id === profile?.data.id)

  const handleRemoveStudent = (studentId: number) => () => {
    mutateRemoveStudentFromGroup({ groupId: data.id, studentId })
  }

  const { mutate: mutateGrantTask } = useMutation({
    mutationFn: groupTaskService.create,
    onSuccess: (payload) => {
      if (queryKey) {
        queryClient.setQueryData(queryKey, (old: GetListGroupResponse['data']) => {
          const newTaskInfo: GroupTaskInfo = {
            id: payload.taskInfo.id,
            description: payload.taskInfo.description,
            endDate: payload.endDate,
            startDate: payload.startDate,
            taskName: payload.taskInfo.name,
            groupId: payload.groupInfo.id,
            groupName: payload.groupInfo.name,
          }

          return {
            ...old,
            content: old.content.map((group) => {
              if (group.id === data.id) {
                return {
                  ...group,
                  groupTaskInfo: [...group.groupTaskInfo, newTaskInfo],
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
                  groupTaskInfo: group.groupTaskInfo.filter((task) => task.id !== selectedDeleteTask),
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

  const handleActionTask = async (payload: {
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
              taskId: Number(selectedEditTask.taskId),
              endDate: new Date(payload.endDate).toISOString(),
              startDate: new Date(payload.startDate).toISOString(),
            })
          : Promise.resolve(),
        payload.name || payload.description
          ? mutateUpdateTask({
              id: Number(selectedEditTask.taskId),
              name: payload.name,
              description: payload.description,
            })
          : Promise.resolve(),
      ]

      await Promise.allSettled(updateTaskPromises)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: groupKeys.all })
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

  const { mutate: mutateEnroll } = useMutation({
    mutationFn: groupService.enroll,
    onSuccess: () => {
      if (queryKey && profile) {
        queryClient.setQueryData(queryKey, (old: GetListGroupResponse['data']) => {
          return {
            ...old,
            content: old.content.map((group) => {
              if (group.id === data.id) {
                return {
                  ...group,
                  studentInfo: [...group.studentInfo, profile.data],
                }
              }
              return group
            }),
          }
        })
      }
      triggerAlert('Enroll successfully', 'success')
    },
    onError: () => {
      triggerAlert('Enroll failed', 'error')
    },
  })

  const { mutate: mutateLeave, isPending: isLoadingLeave } = useMutation({
    mutationFn: groupService.leave,
    onSuccess: () => {
      if (queryKey && profile) {
        queryClient.setQueryData(queryKey, (old: GetListGroupResponse['data']) => {
          console.log(old.content)
          return {
            ...old,
            content: old.content.map((group) => {
              if (group.id === data.id) {
                return {
                  ...group,
                  studentInfo: group.studentInfo.filter((student) => student.id !== profile?.data.id),
                }
              }
              return group
            }),
          }
        })
      }
      triggerAlert('Leave successfully', 'success')
    },
    onError: () => {
      triggerAlert('Leave failed', 'error')
    },
  })

  const { mutate: mutateRemoveStudentFromGroup } = useMutation({
    mutationFn: groupService.removeStudentFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      triggerAlert('Remove student successfully', 'success')
    },
    onError: () => {
      triggerAlert('Remove student failed', 'error')
    },
  })

  const { mutate: mutateChangeLock } = useMutation({
    mutationFn: groupService.changeLock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      triggerAlert('Change lock successfully', 'success')
    },
  })

  const totalMemberGroup = data.studentInfo.length
  const restMember = data.size - totalMemberGroup

  const handleUpdateTask = (task: GroupTaskInfo) => () => {
    form.setValue('name', task.taskName)
    form.setValue('description', task.description)
    form.setValue('startDate', task.startDate)
    form.setValue('endDate', task.endDate)

    setSelectedEditTask(task)
  }

  const handleEnroll = () => {
    if (isStudent && !isStudentExistIngroup) {
      mutateEnroll(data.id)
    }
  }

  const handleLeave = () => {
    if (isStudent) {
      mutateLeave(data.id)
    } else {
      triggerAlert('You are not a student', 'error')
    }
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
            border={profile?.data.id === student.id ? 2 : 1}
            borderRadius={3}
            p={1}
            borderColor={profile?.data.id === student.id ? blue[500] : '#ededed'}
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
                onClick={handleRemoveStudent(student.id)}
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
                  bgcolor: isStudent && (isStudentExistIngroup || data.isLocked) ? '' : primary[50],
                  cursor:
                    disabled || (isStudent && (isStudentExistIngroup || data.isLocked)) ? 'not-allowed' : 'pointer',
                },
              }}
              onClick={() => (isTeacher ? onAddStudent() : !disabled && handleEnroll())}
            >
              <AddRounded color='primary' />
            </Flex>
          ))}
        {isStudent && data.studentInfo.some((student) => student.id === profile?.data.id) && (
          <LoadingButton
            onClick={handleLeave}
            color='error'
            variant='outlined'
            startIcon={<LogoutRounded />}
            sx={{ cursor: data.isLocked ? 'not-allowed' : 'pointer' }}
            disabled={data.isLocked}
            isLoading={isLoadingLeave}
          >
            Leave
          </LoadingButton>
        )}
      </>
    )
  }

  const renderTasks = () => {
    return data.groupTaskInfo.length > 0 ? (
      data.groupTaskInfo.map((task, index) => (
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

  const handleToggleLock = () => {
    mutateChangeLock({ groupId: data.id, isLocked: !data.isLocked })
  }

  return (
    <>
      <Card variant='outlined' sx={{ opacity: disabled ? 0.6 : 1, height: '100%', position: 'relative' }}>
        {isStudent && data.isLocked && !disabled && (
          <Flex
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.4)',
              z: 10,
              opacity: 0,
              ':hover': {
                opacity: 1,
              },
              transition: 'all ease 0.3s',
            }}
            justifyContent='center'
          >
            <Typography textAlign='center' color='#fff' fontWeight={600} variant='h6'>
              This group is locked!
            </Typography>
          </Flex>
        )}
        <CardContent sx={{ height: '100%' }}>
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
                  <Flex>
                    <CustomTooltip title={data.isLocked ? 'Open this group' : 'Lock this group'}>
                      {data.isLocked ? (
                        <LockRounded sx={{ color: red[500], cursor: 'pointer' }} onClick={handleToggleLock} />
                      ) : (
                        <LockOpenRounded sx={{ color: gray[500], cursor: 'pointer' }} onClick={handleToggleLock} />
                      )}
                    </CustomTooltip>
                    <IconButton onClick={onOpen}>
                      <MoreVertRounded fontSize='small' />
                    </IconButton>
                  </Flex>
                ) : (
                  <MuiButton startIcon={<AddRounded fontSize='small' />} size='small' onClick={openAddTask}>
                    Add task
                  </MuiButton>
                )}
              </Flex>
            )}
            {isStudent && data.isLocked && <LockRounded color='error' />}
          </Flex>
          <Divider sx={{ my: 2 }} />
          <Stack gap={2}>{state === 'member' ? renderMembers() : renderTasks()}</Stack>
        </CardContent>
      </Card>
      <ModalActionsTask
        isOpen={isOpenAddTask || !!selectedEditTask}
        onClose={handleCloseModalTask}
        onSubmit={handleActionTask}
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
