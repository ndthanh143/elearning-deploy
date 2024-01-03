import actions from '@/assets/images/icons/actions'
import { ConfirmPopup, Loading, NoData } from '@/components'
import { useBoolean } from '@/hooks'
import { Module } from '@/services/module/module.dto'
import { moduleKey } from '@/services/module/module.query'
import { ArticleOutlined, DeleteOutline, EditOutlined, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Button, Collapse, Divider, Stack, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
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

export type ModuleTeacherProps = {
  lessonPlanId: number
  onEdit: () => void
  onDelete: () => void
}

export const ModuleTeacher = ({ lessonPlanId, onEdit, onDelete }: ModuleTeacherProps) => {
  const moduleInstance = moduleKey.list({ lessonPlanId })
  const { data: modules, refetch: refetchModules, isLoading: isLoadingModules } = useQuery({ ...moduleInstance })

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
      refetchModules()
    },
  })

  const { mutate: deleteLecture } = useMutation({
    mutationFn: lectureService.delete,
    onSuccess: () => {
      toast.success('Delete lecture successfully')
      refetchModules()
    },
  })

  const { mutate: deleteQuiz } = useMutation({
    mutationFn: quizService.delete,
    onSuccess: () => {
      toast.success('Delete quiz successfully')
      refetchModules()
    },
    onError: () => {
      toast.error('This quiz had submission before, can not delete it')
    },
  })

  const { mutate } = useMutation({
    mutationFn: moduleService.create,
    onSuccess: () => {
      closeAddSection()
      refetchModules()
      toast.success('Create module successfully!')
    },
  })

  const handleCreateSection = (data: SectionModalProps) => {
    mutate({ ...data, lessonPlanId })
  }

  const { mutate: deleteResource } = useMutation({
    mutationFn: resourceService.delete,
    onSuccess: () => {
      toast.success('Delete resource successfully')
      refetchModules()
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
    if (modules?.content.length === expandModuleList.length) {
      setExpandModuleList([])
    } else {
      const moduleIdList = modules?.content.map((module) => module.id) || []
      setExpandModuleList(moduleIdList)
    }
  }

  const handleDownloadResource = (urlDocument: string) => {
    downloadFileByLink(urlDocument)
    // mutateDownloadFile(urlDocument)
  }

  const isNotEmptyModule = (module: Module) => {
    return (
      module.lectureInfo?.length ||
      module.resourceInfo?.length ||
      module.assignmentInfo?.length ||
      module.quizInfo?.length
    )
  }

  if (isLoadingModules) {
    return <Loading />
  }

  return (
    modules && (
      <Stack gap={2} minHeight='70vh'>
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
        {!modules.content.length ? (
          <NoData title='No content in this plan!' />
        ) : (
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
            <Typography variant='body2'>{modules.content.length || 0} Sections</Typography>
            <Button variant='text' onClick={handleToggleModuleListAll}>
              {modules.content.length === expandModuleList.length ? (
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
          {modules.content.map((module) => (
            <Stack border={1} borderRadius={3} padding={2} gap={2} key={module.id}>
              <ActionsModule module={module} />
              <Divider />
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                sx={{ cursor: 'pointer' }}
                onClick={() => handleExpandModuleList(module.id)}
              >
                <Box display='flex' alignItems='center' gap={2}>
                  <KeyboardArrowDown />
                  <Typography fontWeight={500}>{module.modulesName}</Typography>
                </Box>
                <Stack direction='row' gap={3}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <ArticleOutlined color='primary' />
                    <Typography>{module.lectureInfo?.length}</Typography>
                  </Box>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Box component='img' src={actions.assignment} alt='assignment' width={25} />
                    <Typography>{module.assignmentInfo?.length}</Typography>
                  </Box>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Box component='img' src={actions.quiz} alt='assignment' width={25} />
                    <Typography>{module.quizInfo?.length}</Typography>
                  </Box>
                </Stack>
              </Box>
              <Collapse in={expandModuleList.includes(module.id)} timeout='auto' unmountOnExit>
                <Divider />
                {isNotEmptyModule(module) ? (
                  <Stack gap={1} mt={1}>
                    {module.lectureInfo.map((lecture) => (
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
                            moduleId={module.id}
                          />
                        )}
                      </>
                    ))}
                    {module.assignmentInfo.map((assignment) => (
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
                            moduleId={module.id}
                          />
                        )}
                      </>
                    ))}
                    {module.quizInfo.map((quiz) => (
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
                    {module.resourceInfo.map((resource) => (
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
                            moduleId={module.id}
                          />
                        )}
                      </>
                    ))}
                  </Stack>
                ) : (
                  <NoData title='No content in this module' />
                )}
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
    )
  )
}
