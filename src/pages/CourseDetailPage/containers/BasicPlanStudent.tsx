import actions from '@/assets/images/icons/actions'
import { NoData } from '@/components'
import { ArticleOutlined, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Button, Collapse, Divider, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Unit } from '@/services/unit/types'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { ContentItem } from '../components'
import { handleCountItemInParent, handleMappedChildrenUnitByParent, handleMappedUnits } from '@/utils'

export type BasicPlanStudentProps = {
  lessonPlan: LessonPlan
}

export const BasicPlanStudent = ({ lessonPlan }: BasicPlanStudentProps) => {
  const units = lessonPlan.units

  const [expandModuleList, setExpandModuleList] = useState<number[]>([])

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

  const mappedUnits = handleMappedUnits(units)

  const mappedChildrenUnitByParent: Record<number, Unit & { children: Unit[] }> =
    handleMappedChildrenUnitByParent(mappedUnits) || {}

  return (
    units && (
      <Stack gap={1}>
        {!units.length ? (
          <NoData title='No content in this plan!' />
        ) : (
          <Box display='flex' justifyContent='end' alignItems='center' mb={1}>
            <Button variant='text' onClick={handleToggleModuleListAll}>
              {units.length === expandModuleList.length ? (
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
            <Stack border={1} borderRadius={3} padding={2} gap={2} key={unit.id}>
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
                <Stack direction='row' gap={3}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <ArticleOutlined color='primary' />
                    <Typography>
                      {handleCountItemInParent(mappedChildrenUnitByParent[unit.id]?.children).lecture}
                    </Typography>
                  </Box>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Box component='img' src={actions.assignment} alt='assignment' width={25} />
                    <Typography>
                      {handleCountItemInParent(mappedChildrenUnitByParent[unit.id]?.children).assignment}
                    </Typography>
                  </Box>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Box component='img' src={actions.quiz} alt='assignment' width={25} />
                    <Typography>
                      {handleCountItemInParent(mappedChildrenUnitByParent[unit.id]?.children).quiz}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Collapse in={expandModuleList.includes(unit.id)} timeout='auto' unmountOnExit>
                <Divider />
                <Stack gap={1}>
                  {mappedChildrenUnitByParent[unit.id]?.children.length === 0 && <NoData title='No Content yet' />}
                  {mappedChildrenUnitByParent[unit.id]?.children.map((child) => {
                    return <ContentItem unit={child} key={child.id} />
                  })}
                </Stack>
              </Collapse>
            </Stack>
          ))}
        </Stack>
      </Stack>
    )
  )
}
