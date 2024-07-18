import {
  Button,
  ConfirmPopup,
  CustomModal,
  CustomSelect,
  Flex,
  Link,
  Loading,
  LoadingButton,
  NoData,
} from '@/components'
import { useAlert, useBoolean } from '@/hooks'
import { AddRounded, AutoModeRounded } from '@mui/icons-material'
import {
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Button as MuiButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { GroupCard, ModalAutoGenerateGroup, ModalListStudentToAdd } from './components'
import { courseKeys } from '@/services/course/course.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { icons } from '@/assets/icons'
import { groupKeys } from '@/services/group/query'
import { GetListGroupResponse, Group } from '@/services/group/dto'
import { groupService } from '@/services'
import { number, object, string } from 'yup'
import { UseFormReturn, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

type ModalGroupForm = UseFormReturn<
  {
    name: string
    size: number
  },
  any,
  undefined
>

const schema = object({
  name: string().required('Name is required'),
  size: number()
    .min(2, 'Group must at least 2 members')
    .max(50, 'Group maximum 50 members')
    .required('Size is required'),
})

const ModalAddGroup = ({
  isOpen,
  onClose,
  form,
  onSubmit,
  status = 'create',
  loading,
}: {
  isOpen: boolean
  onClose: () => void
  form: ModalGroupForm
  status?: 'create' | 'update'
  loading: boolean
  onSubmit: (payload: { name: string; size: number }) => void
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <CustomModal
      title={status === 'create' ? 'Create new group' : 'Update group'}
      isOpen={isOpen}
      onClose={onClose}
      sx={{ maxWidth: 400 }}
    >
      <Stack component='form' onSubmit={handleSubmit(onSubmit)} gap={2}>
        <TextField label='Name' {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
        <TextField
          type='number'
          label='Size'
          {...register('size')}
          error={!!errors.size}
          helperText={errors.size?.message}
        />

        <LoadingButton variant='contained' fullWidth type='submit' isLoading={loading}>
          {status === 'create' ? 'Create' : 'Save'}
        </LoadingButton>
      </Stack>
    </CustomModal>
  )
}

const AddGroup = ({ onClick }: { onClick: () => void }) => {
  return (
    <Card variant='outlined' sx={{ height: '100%', cursor: 'pointer' }} onClick={onClick}>
      <CardContent sx={{ height: '100%' }}>
        <Flex justifyContent='center' alignItems='center' height='100%' gap={1}>
          <AddRounded fontSize='small' color='primary' />
          <Typography variant='body1' color='primary'>
            Add new group
          </Typography>
        </Flex>
      </CardContent>
    </Card>
  )
}

export type FormDataGenerateGroup = UseFormReturn<
  {
    maxMember: number
    minMember: number
  },
  any,
  undefined
>

const generateGroupSchema = object({
  maxMember: number().required('Max member is required'),
  minMember: number().required('Min member is required'),
})

export const GroupManagementPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { triggerAlert } = useAlert()
  const [state, setState] = useState<'member' | 'task'>('member')
  const [selectedDeleteGroup, setSelectedDeleteGroup] = useState<number | null>(null)
  const [selectedGroupEdit, setSelectedGroupEdit] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const handleChangeState = (state: 'member' | 'task') => () => {
    setState(state)
  }

  const form = useForm({ resolver: yupResolver(schema) })
  const { setValue } = form

  const formGenerateGroup = useForm({ resolver: yupResolver(generateGroupSchema) })

  const { value: isOpenCreateGroup, setTrue: openModalCreateGroup, setFalse: closeModalCreateGroup } = useBoolean()
  const { value: isOpenGenerateGroup, setTrue: openModalGenerate, setFalse: closeModalGenerate } = useBoolean()

  const coursesInstance = courseKeys.myCourse({})
  const { data: courses, isFetched: isFetchedCourses } = useQuery({
    ...coursesInstance,
  })

  const groupInstance = groupKeys.list({ courseId: Number(selectedCourseId) })
  const {
    data: groups,
    refetch: refetchGroups,
    isFetched: isFetchedGroups,
    isLoading: isLoadingGroups,
  } = useQuery({
    ...groupInstance,
    enabled: Boolean(selectedCourseId),
  })

  const { mutate: mutateCreateGroup, isPending: isPendingCreateGroup } = useMutation({
    mutationFn: groupService.create,
    onSuccess: (payload) => {
      queryClient.setQueryData(groupInstance.queryKey, (oldData: GetListGroupResponse['data']) => {
        const newData = { ...payload, studentInfo: [] }
        return {
          ...oldData,
          content: [...oldData.content, newData],
        }
      })
      closeModalCreateGroup()
      triggerAlert('Create group successfully')
    },
    onError: () => {
      triggerAlert('Create group failed', 'error')
    },
  })

  const { mutate: mutateUpdateGroup } = useMutation({
    mutationFn: groupService.update,
    onSuccess: (payload) => {
      queryClient.setQueryData(groupInstance.queryKey, (oldData: GetListGroupResponse['data']) => {
        const newData = { ...payload, studentInfo: [] }
        return {
          ...oldData,
          content: oldData.content.map((group) =>
            group.id === payload.id ? { ...newData, groupTaskInfo: group.groupTaskInfo || [] } : group,
          ),
        }
      })
      setSelectedGroupEdit(null)
      closeModalCreateGroup()
      triggerAlert('Update group successfully')
    },
    onError: () => {
      triggerAlert('Update group failed', 'error')
    },
  })

  const { mutate: mutateDeleteGroup, isPending: isPendingDeleteGroup } = useMutation({
    mutationFn: groupService.delete,
    onSuccess: () => {
      queryClient.setQueryData(groupInstance.queryKey, (oldData: GetListGroupResponse['data']) => {
        return {
          ...oldData,
          content: oldData.content.filter((group) => group.id !== selectedDeleteGroup),
        }
      })
      setSelectedDeleteGroup(null)
      triggerAlert('Remove group successfully')
    },
    onError: () => {
      triggerAlert('Remove group failed', 'error')
    },
  })

  const { mutate: mutateGenerateGroup, isPending: isPendingGenerate } = useMutation({
    mutationFn: groupService.autoGenerate,
    onSuccess: () => {
      refetchGroups()
      closeModalGenerate()
      triggerAlert('Genearte groups successfully')
    },
  })

  const handleDeleteGroup = () => {
    selectedDeleteGroup && mutateDeleteGroup(selectedDeleteGroup)
  }

  const handleCreateGroup = (payload: { name: string; size: number }) => {
    if (selectedGroupEdit) {
      mutateUpdateGroup({ id: selectedGroupEdit, ...payload })
    } else {
      if (selectedCourseId) {
        mutateCreateGroup({ courseId: selectedCourseId, ...payload })
      } else {
        triggerAlert('Please select a course', 'error')
      }
    }
  }

  const handleOpenUpdateGroup = (group: Group) => () => {
    setValue('name', group.name)
    setValue('size', group.size)
    setSelectedGroupEdit(group.id)
    openModalCreateGroup()
  }

  const handleGenerateGroup = (payload: { minMember: number; maxMember: number }) => {
    if (selectedCourseId) {
      mutateGenerateGroup({ courseId: selectedCourseId, ...payload })
    } else {
      triggerAlert('Please select a course', 'error')
    }
  }

  useEffect(() => {
    if (courses && isFetchedCourses && courses.content.length > 0) {
      setSelectedCourseId(courses.content[0].id)
    }
  }, [isFetchedCourses, courses])

  const listStudent = groups?.content.map((group) => group.studentInfo.map((student) => student.id)).flat() || []

  if (isFetchedCourses && courses?.totalElements === 0) {
    return (
      <Container>
        <Flex height='100%' justifyContent='center' alignItems='center' minHeight='60vh'>
          <Stack gap={2} alignItems='center'>
            {icons['noData']}
            <Typography variant='body1'>
              You haven't any course yet. Please create a course to using this features
            </Typography>
            <Link href='/courses/create'>
              <MuiButton variant='contained'>Create your first course</MuiButton>
            </Link>
          </Stack>
        </Flex>
      </Container>
    )
  }

  return (
    <>
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

              <Flex gap={2}>
                <CustomSelect
                  data={
                    courses?.content.map((course) => ({
                      label: course.courseName,
                      value: Number(course.id),
                    })) || []
                  }
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  size='small'
                />
              </Flex>
            </Flex>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {(!isFetchedGroups || isLoadingGroups) && (
                <Flex width='100%' minHeight={'60vh'}>
                  <Loading />
                </Flex>
              )}
              {groups?.content.map((group, index) => (
                <Fragment key={group.id}>
                  <Grid item xs={12} sm={6} md={6} lg={4}>
                    <GroupCard
                      size={4}
                      state={state}
                      data={group}
                      onUpdate={handleOpenUpdateGroup(group)}
                      onDelete={() => setSelectedDeleteGroup(group.id)}
                      queryKey={groupInstance.queryKey}
                      onAddStudent={() => setSelectedGroup(group)}
                    />
                  </Grid>
                  {index === groups.content.length - 1 && state === 'member' && (
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                      <AddGroup onClick={openModalCreateGroup} />
                    </Grid>
                  )}
                </Fragment>
              ))}
            </Grid>
            {groups?.content.length === 0 &&
              (state === 'member' ? (
                <Flex height='100%' justifyContent='center' alignItems='center' minHeight='60vh'>
                  <Stack gap={2} alignItems='center'>
                    {icons['noData']}
                    <MuiButton startIcon={<AddRounded />} onClick={openModalCreateGroup}>
                      Create New Group
                    </MuiButton>
                    <Divider>Or</Divider>
                    <Button startIcon={<AutoModeRounded />} onClick={openModalGenerate}>
                      Auto Generate Group
                    </Button>
                  </Stack>
                </Flex>
              ) : (
                <Stack sx={{ py: 4 }}>
                  <NoData title='This course have no group!' />
                </Stack>
              ))}
          </CardContent>
        </Card>
      </Container>
      <ModalAddGroup
        isOpen={isOpenCreateGroup}
        onClose={closeModalCreateGroup}
        form={form}
        onSubmit={handleCreateGroup}
        loading={isPendingCreateGroup}
        status={selectedGroupEdit ? 'update' : 'create'}
      />
      <ModalAutoGenerateGroup
        isOpen={isOpenGenerateGroup}
        onClose={closeModalGenerate}
        form={formGenerateGroup}
        loading={isPendingGenerate}
        onSubmit={handleGenerateGroup}
      />
      <ConfirmPopup
        isOpen={!!selectedDeleteGroup}
        onClose={() => {
          setSelectedDeleteGroup(null)
        }}
        title='Delete group'
        subtitle='Are you sure you want to delete this group?'
        type='delete'
        isLoading={isPendingDeleteGroup}
        onAccept={handleDeleteGroup}
      />
      {selectedCourseId && selectedGroup && (
        <ModalListStudentToAdd
          listExistStudent={listStudent}
          isOpen={Boolean(selectedGroup && selectedCourseId)}
          courseId={selectedCourseId}
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          onClose={() => setSelectedGroup(null)}
          maxStudent={selectedGroup.size - selectedGroup.studentInfo.length}
        />
      )}
    </>
  )
}
