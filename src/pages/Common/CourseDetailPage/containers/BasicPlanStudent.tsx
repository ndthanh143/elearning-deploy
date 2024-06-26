import actions from '@/assets/images/icons/actions'
import { Flex, IconContainer, NoData } from '@/components'
import { EditRounded, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Collapse, Divider, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Unit, UnitType } from '@/services/unit/types'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { ContentItem } from '../components'
import { handleCountItemInParen, handleMappedChildrenUnitByParent, handleMappedUnits } from '@/utils'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'

export type BasicPlanStudentProps = {
  lessonPlan: LessonPlan
}

export const BasicPlanStudent = ({ lessonPlan }: BasicPlanStudentProps) => {
  const { isTeacher } = useAuth()

  const navigate = useNavigate()
  const units = lessonPlan.units

  const [expandModuleList, setExpandModuleList] = useState<number[]>(units?.map((module) => module.id) || [])

  const handleExpandModuleList = (moduleId: number) => {
    if (expandModuleList.includes(moduleId)) {
      setExpandModuleList((prev) => prev.filter((item) => item !== moduleId))
    } else {
      setExpandModuleList((prev) => [...prev, moduleId])
    }
  }

  const handleToggleModuleListAll = () => {
    if (units?.length === expandModuleList.length) {
      setExpandModuleList([])
    } else {
      const moduleIdList = units?.map((module) => module.id) || []
      setExpandModuleList(moduleIdList)
    }
  }

  const handleNavigateEditLessonPlan = () => {
    navigate(`/planning/${lessonPlan.id}`)
  }

  const mappedUnits = handleMappedUnits(units)

  const mappedChildrenUnitByParent: Record<number, Unit & { children: Unit[] }> =
    handleMappedChildrenUnitByParent(mappedUnits) || {}

  const labelCounts = [
    {
      label: 'lecture',
      icon: actions.lecture,
    },
    {
      label: 'assignment',
      icon: actions.assignment,
    },
    {
      label: 'quiz',
      icon: actions.quiz,
    },
    {
      label: 'resource',
      icon: actions.resource,
    },
    {
      label: 'video',
      icon: actions.video,
    },
  ]

  return (
    units && (
      <Stack gap={1}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Flex gap={2}>
            <Typography fontWeight={700}>Content</Typography>
            {isTeacher && (
              <IconContainer isActive sx={{ cursor: 'pointer' }} onClick={handleNavigateEditLessonPlan}>
                <EditRounded fontSize='small' color='primary' sx={{ width: 18, height: 18 }} />
              </IconContainer>
            )}
          </Flex>
          {units.length > 0 && (
            <Flex justifyContent='end' mb={1}>
              <Button variant='text' onClick={handleToggleModuleListAll}>
                {units.length === expandModuleList.length ? (
                  <>
                    Collapse <KeyboardArrowUp />
                  </>
                ) : (
                  <>
                    Expand <KeyboardArrowDown />
                  </>
                )}
              </Button>
            </Flex>
          )}
        </Flex>
        <Stack gap={1}>
          {!units.length && <NoData title='No content in this course!' />}
          <Stack gap={4}>
            {mappedUnits?.group.map((unit) => (
              <Card>
                <CardContent>
                  <Stack gap={2} key={unit.id}>
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                      sx={{ cursor: 'pointer' }}
                      gap={2}
                      onClick={() => handleExpandModuleList(unit.id)}
                    >
                      <Box display='flex' alignItems='center' gap={2}>
                        <KeyboardArrowDown />
                        <Typography fontWeight={500}>{unit.name}</Typography>
                      </Box>
                      <Flex gap={3}>
                        {labelCounts.map((item) => (
                          <>
                            <Box display='flex' alignItems='center' gap={1} key={item.label}>
                              <Box component='img' src={item.icon} alt={item.label} width={25} />
                              <Typography variant='body2'>
                                {
                                  handleCountItemInParen(mappedChildrenUnitByParent[unit.id]?.children)[
                                    item.label as UnitType
                                  ]
                                }
                              </Typography>
                            </Box>
                          </>
                        ))}
                      </Flex>
                    </Box>
                    <Collapse in={expandModuleList.includes(unit.id)} timeout='auto' unmountOnExit>
                      <Divider />
                      <Stack gap={1}>
                        {mappedChildrenUnitByParent[unit.id]?.children.length === 0 && (
                          <Box mt={2}>
                            <NoData title='No Content yet' />
                          </Box>
                        )}
                        {mappedChildrenUnitByParent[unit.id]?.children.map((child) => {
                          return <ContentItem unit={child} key={child.id} />
                        })}
                      </Stack>
                    </Collapse>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Stack>
    )
  )
}
