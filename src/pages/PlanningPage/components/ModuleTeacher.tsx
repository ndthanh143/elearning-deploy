import actions from '@/assets/images/icons/actions'
import { ConfirmPopup, Loading, MindMap, NoData } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { Module } from '@/services/module/module.dto'
import { moduleKey } from '@/services/module/module.query'
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
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ActionsModule } from './ActionsModule'
import { downloadFileByLink, getResourceType } from '@/utils'
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
import { moduleService } from '@/services/module/module.service'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { useNavigate } from 'react-router-dom'
import { gray } from '@/styles/theme'
import { unitKey } from '@/services/unit/query'
import { unitService } from '@/services/unit'
import { Unit } from '@/services/unit/types'

export type BasicPlanTeacherProps = {
  lessonPlanId: number
  onEdit: () => void
  onDelete: () => void
}

export const BasicPlanTeacher = ({ lessonPlanId, onEdit, onDelete }: BasicPlanTeacherProps) => {
  const { profile } = useAuth()

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

  const { mutate } = useMutation({
    mutationFn: unitService.create,
    onSuccess: () => {
      closeAddSection()
      refetchUnits()
      toast.success('Create section successfully!')
    },
  })

  const handleCreateSection = (data: SectionModalProps) => {
    mutate({ name: data.name, description: data.description, lessonPlanId })
  }

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

  const handleDownloadResource = (urlDocument: string) => {
    downloadFileByLink(urlDocument)
    // mutateDownloadFile(urlDocument)
  }

  const isMicroItem = (unit: Unit) => {
    return unit.lectureInfo || unit.resourceInfo || unit.assignmentInfo || unit.quizInfo
  }

  // useEffect(() => {

  //   console.log(mappedUnits)
  // }, [units])

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

  console.log('units', units)

  if (isLoadingUnits) {
    return <Loading />
  }

  const mappedUnits = units?.content.reduce(
    (acc, cur) => {
      if (isMicroItem(cur)) {
        return {
          ...acc,
          children: [...acc.children, cur],
        }
      } else {
        return {
          ...acc,
          group: [...acc.group, cur],
        }
      }
    },
    { group: [] as Unit[], children: [] as Unit[] },
  )

  const renderData = mappedUnits?.group.reduce((acc, cur) => {
    const listChildren = mappedUnits.children.filter((child) => child.parent?.id === cur.id)

    return {
      ...acc,
      [cur.id]: {
        ...cur,
        children: listChildren,
      },
    }
  }, {})

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
          <Button sx={{ display: 'flex', gap: 1 }} variant='outlined' onClick={onEdit}>
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
              <ActionsModule data={unit} />
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
                  {renderData[unit.id]?.children.map((child) => {
                    let childType = 'lecture'
                    if (child.lectureInfo) {
                      childType = 'lecture'
                    }
                    if (child.assignmentInfo) {
                      childType = 'assignment'
                    }

                    return (
                      <ContentItem
                        title={child.name}
                        iconUrl={actions[childType]}
                        key={child.id}
                        onEdit={() => setSelectedLecture(child)}
                        onDelete={() => deleteLecture(child.id)}
                      />
                    )
                  })}
                </Stack>
                {/* {isNotEmptyModule(unit) ? (
                  <Stack gap={1} mt={1}>
                    {unit.lectureInfo.map((lecture) => (
                      <>
                        <ContentItem
                          title={lecture.lectureName}
                          // onClick={() => navigate(`${pathname}/${lecture.id}`)}
                          key={lecture.id}
                          onEdit={() => setSelectedLecture(lecture)}
                          onDelete={() => deleteLecture(lecture.id)}
                        />
                        {selectedLecture && (
                          <LectureActions
                            isOpen
                            onClose={() => setSelectedLecture(null)}
                            defaultData={selectedLecture}
                            status='update'
                            moduleId={unit.id}
                          />
                        )}
                      </>
                    ))}
                    {unit.assignmentInfo.map((assignment) => (
                      <>
                        <ContentItem
                          title={assignment.assignmentTitle}
                          iconUrl={actions.assignment}
                          key={assignment.id}
                          onEdit={() => setSelectedAssignment(assignment)}
                          onDelete={() => deleteAssignment(assignment.id)}
                        />
                        {selectedAssignment && (
                          <AssignmentActions
                            isOpen
                            onClose={() => setSelectedAssignment(null)}
                            defaultData={selectedAssignment}
                            status='update'
                            moduleId={unit.id}
                          />
                        )}
                      </>
                    ))}
                    {unit.quizInfo.map((quiz) => (
                      <>
                        <ContentItem
                          title={quiz.quizTitle}
                          iconUrl={actions.quiz}
                          key={quiz.id}
                          onDelete={() => deleteQuiz(quiz.id)}
                          onEdit={() => setSelectedQuiz(quiz)}
                        />
                      </>
                    ))}
                    {unit.resourceInfo.map((resource) => (
                      <>
                        <ContentItem
                          title={resource.title}
                          iconUrl={getResourceType(resource.urlDocument)}
                          onClick={() => handleDownloadResource(resource.urlDocument)}
                          key={resource.id}
                          onDelete={() => deleteResource(resource.id)}
                          onEdit={() => setSelectedResource(resource)}
                        />
                        {selectedResource && (
                          <ResourceActions
                            isOpen
                            onClose={() => setSelectedResource(null)}
                            defaultData={selectedResource}
                            status='update'
                            moduleId={unit.id}
                          />
                        )}
                      </>
                    ))}
                  </Stack>
                ) : (
                  <NoData title='No content in this module' />
                )} */}
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
            onDelete()
            closeConfirm()
          }}
          isOpen={isOpenConfirm}
        />

        <ModalSection
          status='create'
          isOpen={isOpenAddSection}
          onClose={closeAddSection}
          onSubmit={handleCreateSection}
        />
      </Stack>

      // <MindMap module={modules.content} lessonPlanId={lessonPlanId} />
    )
  )
}
