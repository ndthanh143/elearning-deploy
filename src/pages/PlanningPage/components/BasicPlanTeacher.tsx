import actions from '@/assets/images/icons/actions'
import { ConfirmPopup, Loading, MindMap, NoData } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { Module } from '@/services/module/module.dto'
import {
  ArticleOutlined,
  ChevronLeftOutlined,
  DeleteOutline,
  EditOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHorizOutlined,
} from '@mui/icons-material'
import { Box, Button, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ActionsUnit } from './ActionsUnit'
import { downloadFileByLink, getResourceType, handleMappedChildrenUnitByParent, handleMappedUnits } from '@/utils'
import { ContentItem } from './ContentItem'
import { ModalSection, AssignmentActions, LectureActions, QuizActions, SectionModalProps } from '../modals'
import { assignmentService } from '@/services/assignment/assignment.service'
import { toast } from 'react-toastify'
import { lectureService } from '@/services/lecture/lecture.service'
import { quizService } from '@/services/quiz/quiz.service'
import { resourceService } from '@/services/resource/resource.service'
import { Lecture } from '@/services/lecture/lecture.dto'
import { Assignment } from '@/services/assignment/assignment.dto'
import { Resource } from '@/services/resource/resource.dto'
import { ResourceActions } from '../modals/ResourceActions'
import { Quiz } from '@/services/quiz/quiz.dto'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { useNavigate } from 'react-router-dom'
import { gray } from '@/styles/theme'
import { unitKey } from '@/services/unit/query'
import { unitService } from '@/services/unit'
import { Unit } from '@/services/unit/types'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'

export type BasicPlanTeacherProps = {
  lessonPlanId: number
}

export const BasicPlanTeacher = ({ lessonPlanId }: BasicPlanTeacherProps) => {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

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

  const { value: isOpenAddSection, setTrue: openAddSection, setFalse: closeAddSection } = useBoolean()
  const { value: isOpenConfirm, setTrue: openConfirm, setFalse: closeConfirm } = useBoolean()

  const { mutate: deleteAssignment } = useMutation({
    mutationFn: assignmentService.delete,
    onSuccess: () => {
      toast.success('Delete assignment successfully')
      refetchUnits()
    },
  })

  const { mutate: deleteLecture } = useMutation({
    mutationFn: lectureService.delete,
    onSuccess: () => {
      toast.success('Delete lecture successfully')
      refetchUnits()
    },
  })

  const { mutate: deleteQuiz } = useMutation({
    mutationFn: quizService.delete,
    onSuccess: () => {
      toast.success('Delete quiz successfully')
      refetchUnits()
    },
    onError: () => {
      toast.error('This quiz had submission before, can not delete it')
    },
  })

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
    mutationFn: unitService.update,
    onSuccess: () => {
      closeAddSection()
      refetchUnits()
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      toast.success('Update lesson plan successfully!')
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

  const { mutate: deleteResource } = useMutation({
    mutationFn: resourceService.delete,
    onSuccess: () => {
      toast.success('Delete resource successfully')
      refetchUnits()
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

  const handleDownloadResource = (urlDocument: string) => {
    downloadFileByLink(urlDocument)
    // mutateDownloadFile(urlDocument)
  }

  const isMicroItem = (unit: Unit) => {
    return unit.lectureInfo || unit.resourceInfo || unit.assignmentInfo || unit.quizInfo
  }

  const isNotEmptyModule = (module: Module) => {
    return (
      module.lectureInfo?.length ||
      module.resourceInfo?.length ||
      module.assignmentInfo?.length ||
      module.quizInfo?.length
    )
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
      <Stack gap={2} paddingX={4}>
        <Box
          borderRadius={4}
          bgcolor='white'
          display='flex'
          border={1}
          borderColor={gray[200]}
          gap={1}
          top={20}
          px={2}
          py={1}
          width='fit-content'
          left={20}
          zIndex={10}
        >
          <IconButton onClick={handleBackPage} color='secondary'>
            <ChevronLeftOutlined />
          </IconButton>
          <Button
            variant='text'
            color='secondary'
            sx={{ display: 'flex', alignItems: 'center', px: 2, fontWeight: 700 }}
          >
            {currentLessonPlan?.name}
            <ChevronLeftOutlined sx={{ rotate: '-90deg' }} fontSize='small' />
          </Button>
          <Divider orientation='vertical' flexItem />
          <IconButton color='secondary'>
            <MoreHorizOutlined />
          </IconButton>
        </Box>
        <Stack direction='row' gap={2} justifyContent='end'>
          <Button sx={{ display: 'flex', gap: 1 }} variant='outlined'>
            <EditOutlined fontSize='small' />
            Edit
          </Button>
          <Button sx={{ display: 'flex', gap: 1 }} color='error' variant='outlined' onClick={openConfirm}>
            <DeleteOutline fontSize='small' /> Delete
          </Button>
        </Stack>
        <Button fullWidth variant='outlined' onClick={openAddSection}>
          Add sections
        </Button>
        {!units.content.length ? (
          <NoData title='No content in this plan!' />
        ) : (
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
            <Typography variant='body2'>{units.content.length || 0} Sections</Typography>
            <Button variant='text' onClick={handleToggleModuleListAll}>
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
        <Stack gap={2}>
          {mappedUnits?.group.map((unit) => (
            <Stack border={1} borderRadius={3} padding={2} gap={2} key={unit.id}>
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
                <Stack gap={1}>
                  {mappedChildrenUnitByParent[unit.id]?.children.map((child) => {
                    return (
                      <ContentItem
                        unit={child}
                        key={child.id}
                        onEdit={() => handleEditItem(child)}
                        onDelete={() => deleteLecture(child.id)}
                      />
                    )
                  })}
                </Stack>
              </Collapse>
            </Stack>
          ))}
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
      </Stack>
    )
  )
}
