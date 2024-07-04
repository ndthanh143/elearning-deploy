import { Flex, NoData } from '@/components'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Collapse, Divider, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Unit, UnitType } from '@/services/unit/types'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { handleCountItemInParent, handleMappedChildrenUnitByParent, handleMappedUnits } from '@/utils'
import { ContentItem } from '@/pages/Common/CourseDetailPage/components'
import { useParams } from 'react-router-dom'
import { primary } from '@/styles/theme'
import actions from '@/assets/images/icons/actions'

export type BasicPlanStudentProps = {
  lessonPlan: LessonPlan
}

export const SideContentCourse = ({ lessonPlan }: BasicPlanStudentProps) => {
  const units = lessonPlan.units

  const { unitId } = useParams()

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

  const mappedUnits = handleMappedUnits(units)

  const mappedChildrenUnitByParent: Record<number, Unit & { children: Unit[] }> =
    handleMappedChildrenUnitByParent(mappedUnits) || {}

  return (
    units && (
      <Stack gap={1} height='100%' width='100%'>
        <Flex alignItems='center' justifyContent='space-between'>
          <Typography fontWeight={600}>Course content</Typography>
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
        <Stack gap={1} width='100%' flex={1} sx={{ overflowY: 'scroll' }}>
          <Stack gap={1}>
            {mappedUnits?.group.map((unit) => (
              <Card variant='outlined'>
                <CardContent sx={{ px: 0 }}>
                  <Stack gap={2} key={unit.id}>
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                      sx={{ cursor: 'pointer', px: 2 }}
                      gap={2}
                      onClick={() => handleExpandModuleList(unit.id)}
                    >
                      <Stack gap={1}>
                        <Box display='flex' alignItems='center' gap={2}>
                          <KeyboardArrowDown />
                          <Typography fontWeight={500}>{unit.name}</Typography>
                        </Box>
                        <Flex gap={3}>
                          {labelCounts.map((item) => {
                            const count = handleCountItemInParent(mappedChildrenUnitByParent[unit.id]?.children)[
                              item.label as UnitType
                            ]
                            return (
                              count > 0 && (
                                <Box display='flex' alignItems='center' gap={1} key={item.label}>
                                  <Box component='img' src={item.icon} alt={item.label} width={20} />
                                  <Typography variant='body2'>{count}</Typography>
                                </Box>
                              )
                            )
                          })}
                        </Flex>
                      </Stack>
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
                          return (
                            <Box
                              key={child.id}
                              sx={{ px: 2, bgcolor: Number(unitId) === child.id ? primary[100] : 'transparent' }}
                            >
                              <ContentItem unit={child} />
                            </Box>
                          )
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
