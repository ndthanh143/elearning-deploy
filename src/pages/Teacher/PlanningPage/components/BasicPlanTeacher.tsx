import actions from '@/assets/images/icons/actions'
import { ConfirmPopup, Flex, Loading, NoData } from '@/components'
import { useAlert, useAuth, useBoolean } from '@/hooks'
import {
  AddOutlined,
  ArrowBackOutlined,
  ArticleOutlined,
  DeleteRounded,
  DoNotDisturbAltRounded,
  EditRounded,
  KeyboardArrowDown,
  KeyboardArrowUp,
  SaveRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ActionsUnit } from './ActionsUnit'
import { handleMappedChildrenUnitByParent, handleMappedUnits } from '@/utils'
import { ContentItem } from './ContentItem'
import { ModalSection, AssignmentActions, LectureActions, QuizActions, SectionModalProps } from '../modals'
import { assignmentService } from '@/services/assignment/assignment.service'
import { toast } from 'react-toastify'
import { lectureService } from '@/services/lecture/lecture.service'
import { resourceService } from '@/services/resource/resource.service'
import { Lecture } from '@/services/lecture/lecture.dto'
import { Assignment } from '@/services/assignment/assignment.dto'
import { Resource } from '@/services/resource/resource.dto'
import { ResourceActions } from '../modals/ResourceActions'
import { Quiz } from '@/services/quiz/quiz.dto'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { useNavigate } from 'react-router-dom'
import { unitKey } from '@/services/unit/query'
import { unitService } from '@/services/unit'
import { Unit } from '@/services/unit/types'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'
import { object, string } from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export type BasicPlanTeacherProps = {
  lessonPlanId: number
}

const schema = object({ lessonPlanName: string().required('Please fill in your lesson plan name') })

export const BasicPlanTeacher = ({ lessonPlanId }: BasicPlanTeacherProps) => {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const { triggerAlert } = useAlert()

  const unitInstance = unitKey.list({ lessonPlanId, unpaged: true })
  const { data: units, refetch: refetchUnits, isLoading: isLoadingUnits } = useQuery({ ...unitInstance })

  const navigate = useNavigate()

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data: lessonPlans } = useQuery({ ...lessonPlanInstance })
  const currentLessonPlan = lessonPlans?.content.find((lessonPlan) => lessonPlan.id === lessonPlanId)

  const [expandModuleList, setExpandModuleList] = useState<number[]>([])
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      lessonPlanName: currentLessonPlan?.name || '',
    },
  })

  const { value: isOpenAddSection, setTrue: openAddSection, setFalse: closeAddSection } = useBoolean()
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()
  const { value: isEditSectionName, setTrue: setEditSectionName, setFalse: closeEditSectionName } = useBoolean()

  const { mutate: mutateCreateSection } = useMutation({
    mutationFn: unitService.create,
    onSuccess: () => {
      closeAddSection()
      refetchUnits()
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
      toast.success('Create section successfully!')
    },
  })

  const { mutate: mutateUpdatePlan } = useMutation({
    mutationFn: lessonPlanService.update,
    onSuccess: () => {
      closeEditSectionName()
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      triggerAlert('Update lesson plan successfully!')
    },
  })

  const { mutate: mutateDeletePlan } = useMutation({
    mutationFn: lessonPlanService.delete,
    onSuccess: () => {
      toast.success('Delete lesson plan successfully!')
    },
  })

  const handleCreateSection = (data: SectionModalProps) => {
    const lastUnit = units?.content[units.content.length - 1]
    mutateCreateSection({ name: data.name, description: data.description, lessonPlanId, parentId: lastUnit?.id })
  }

  const { mutate: mutateUpdateLecture } = useMutation({
    mutationFn: lectureService.update,
    onSuccess: () => {
      toast.success('Update successfully')
      setSelectedLecture(null)
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
    },
  })

  const { mutate: mutateUpdateAssignment } = useMutation({
    mutationFn: assignmentService.update,
    onSuccess: () => {
      toast.success('Update successfully')
      setSelectedAssignment(null)
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
    },
  })

  const { mutate: mutateUpdateResource } = useMutation({
    mutationFn: resourceService.update,
    onSuccess: () => {
      toast.success('Update successfully')
      setSelectedResource(null)
      queryClient.invalidateQueries({ queryKey: unitKey.lists() })
    },
  })

  const handleExpandModuleList = (moduleId: number) => {
    if (expandModuleList.includes(moduleId)) {
      setExpandModuleList((prev) => prev.filter((item) => item !== moduleId))
    } else {
      setExpandModuleList((prev) => [...prev, moduleId])
    }
  }

  const handleToggleModuleListAll = () => {
    if (units?.content.length === expandModuleList.length) {
      setExpandModuleList([])
    } else {
      const moduleIdList = units?.content.map((module) => module.id) || []
      setExpandModuleList(moduleIdList)
    }
  }

  const handleEditItem = (item: Unit) => {
    if (item.lectureInfo) {
      setSelectedLecture(item.lectureInfo)
    }
    if (item.assignmentInfo) {
      setSelectedAssignment(item.assignmentInfo)
    }
    if (item.resourceInfo) {
      setSelectedResource(item.resourceInfo)
    }
    if (item.quizInfo) {
      setSelectedQuiz(item.quizInfo)
    }
  }

  const handleEditPlan = ({ lessonPlanName }: { lessonPlanName: string }) => {
    mutateUpdatePlan({ id: lessonPlanId, name: lessonPlanName })
  }

  const handleBackPage = () => {
    navigate('/planning')
  }

  if (isLoadingUnits) {
    return <Loading />
  }

  const mappedUnits = handleMappedUnits(units?.content || [])

  const mappedChildrenUnitByParent: Record<number, Unit & { children: Unit[] }> =
    handleMappedChildrenUnitByParent(mappedUnits) || {}

  return (
    units && (
      <Container sx={{ my: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          startIcon={<ArrowBackOutlined fontSize='small' />}
          color='secondary'
          sx={{ width: 'fit-content' }}
          onClick={handleBackPage}
        >
          Back to lesson plans
        </Button>
        <Stack component='form' gap={1} onSubmit={handleSubmit(handleEditPlan)}>
          <Flex gap={2}>
            {isEditSectionName ? (
              <TextField defaultValue={currentLessonPlan?.name} {...register('lessonPlanName')} />
            ) : (
              <Typography variant='h2' fontWeight={500}>
                {currentLessonPlan?.name}
              </Typography>
            )}
            {isEditSectionName ? (
              <Flex gap={0.5}>
                <Box></Box>
                <IconButton color='primary' type='submit' disabled={!isDirty || !isValid}>
                  <SaveRounded fontSize='small' />
                </IconButton>
                <IconButton onClick={closeEditSectionName} type='button'>
                  <DoNotDisturbAltRounded fontSize='small' />
                </IconButton>
              </Flex>
            ) : (
              <Flex gap={0.5}>
                <IconButton color='primary' onClick={setEditSectionName} type='button'>
                  <EditRounded fontSize='small' />
                </IconButton>
                <IconButton color='error' onClick={openConfirm} type='button'>
                  <DeleteRounded fontSize='small' />
                </IconButton>
              </Flex>
            )}
          </Flex>
        </Stack>

        {!units.content.length ? (
          <NoData title='No content in this plan!' />
        ) : (
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Flex gap={1}>
              <Typography>Total sections:</Typography>
              <Chip label={mappedUnits.group.length || 0} color='primary' size='small' sx={{ fontWeight: 500 }} />
            </Flex>

            <Button variant='text' onClick={handleToggleModuleListAll} color='secondary'>
              {units.content.length === expandModuleList.length ? (
                <>
                  Collapse All <KeyboardArrowUp />
                </>
              ) : (
                <>
                  Expand all <KeyboardArrowDown />
                </>
              )}
            </Button>
          </Box>
        )}
        <Stack gap={4}>
          {mappedUnits?.group.map((unit) => (
            <Card key={unit.id}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <ActionsUnit data={unit} />
                <Divider />
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleExpandModuleList(unit.id)}
                >
                  <Box display='flex' alignItems='center' gap={2}>
                    <KeyboardArrowDown />
                    <Typography fontWeight={500}>{unit.name}</Typography>
                  </Box>
                  <Stack direction='row' gap={3}>
                    <Box display='flex' alignItems='center' gap={1}>
                      <ArticleOutlined color='primary' />
                      {/* <Typography>{unit.lectureInfo?.length}</Typography> */}
                    </Box>
                    <Box display='flex' alignItems='center' gap={1}>
                      <Box component='img' src={actions.assignment} alt='assignment' width={25} />
                      {/* <Typography>{unit.assignmentInfo?.length}</Typography> */}
                    </Box>
                    <Box display='flex' alignItems='center' gap={1}>
                      <Box component='img' src={actions.quiz} alt='assignment' width={25} />
                      {/* <Typography>{unit.quizInfo?.length}</Typography> */}
                    </Box>
                  </Stack>
                </Box>
                <Collapse in={expandModuleList.includes(unit.id)} timeout='auto' unmountOnExit>
                  <Divider />
                  {mappedChildrenUnitByParent[unit.id]?.children.length === 0 && (
                    <NoData title='No content in this section!' />
                  )}
                  <Stack gap={1}>
                    {mappedChildrenUnitByParent[unit.id]?.children.map((child) => {
                      return <ContentItem unit={child} key={child.id} onEdit={() => handleEditItem(child)} />
                    })}
                  </Stack>
                </Collapse>
              </CardContent>
            </Card>
          ))}
          <Button fullWidth variant='contained' onClick={openAddSection} startIcon={<AddOutlined />} size='large'>
            Add sections
          </Button>
        </Stack>
        {selectedQuiz && <QuizActions isOpen onClose={() => setSelectedQuiz(null)} defaultData={selectedQuiz} />}
        <ConfirmPopup
          title='Confirm delete'
          subtitle='Are you sure to delete this lesson plan?, this action will be undo.'
          onClose={closeConfirm}
          onAccept={() => {
            mutateDeletePlan(lessonPlanId)
            closeConfirm()
          }}
          isOpen={isOpenConfirm}
          type='delete'
        />
        {selectedLecture && (
          <LectureActions
            isOpen
            onClose={() => setSelectedLecture(null)}
            defaultData={selectedLecture}
            onUpdate={mutateUpdateLecture}
          />
        )}
        {selectedAssignment && (
          <AssignmentActions
            isOpen
            onClose={() => setSelectedAssignment(null)}
            defaultData={selectedAssignment}
            onUpdate={mutateUpdateAssignment}
          />
        )}
        {selectedResource && (
          <ResourceActions
            isOpen
            onClose={() => setSelectedResource(null)}
            defaultData={selectedResource}
            onUpdate={mutateUpdateResource}
          />
        )}
        <ModalSection isOpen={isOpenAddSection} onClose={closeAddSection} onSubmit={handleCreateSection} />
      </Container>
    )
  )
}
