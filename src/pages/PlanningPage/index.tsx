import { BoxContent, NoData, PageContentHeading } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { Box, Button, Grid, List, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { LessonPlanCard, ModuleTeacher } from './components'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { useState } from 'react'
import { AddPlan } from './modals'

export const PlanningPage = () => {
  const { profile } = useAuth()

  const [selectedLessonPlan, setSelectedLessonPlan] = useState<LessonPlan | null>(null)

  const { value: isOpenCreate, setFalse: closeCreate, setTrue: openCreate } = useBoolean(false)

  const lessonPlanInstance = lessonPlanKey.list({ teacherId: profile?.data.id as number })
  const { data } = useQuery({ ...lessonPlanInstance, enabled: !!profile?.data.id })

  return (
    <Box>
      <PageContentHeading
        title='Educator planning'
        subTitle='Strategize, Organize, and Innovate for Effective Teaching and Learning'
      />
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <BoxContent position='sticky' top={90}>
            <Stack height='70vh'>
              <Stack direction='row' justifyContent='space-between' mb={1}>
                <Typography variant='h5'>Your plans</Typography>
                <Button variant='contained' size='small' onClick={openCreate}>
                  New plan
                </Button>
              </Stack>
              {data?.content.length ? (
                <Stack gap={4} maxHeight='100%' sx={{ overflowY: 'scroll' }}>
                  <List>
                    {data.content.map((lessonPlan) => (
                      <LessonPlanCard
                        key={lessonPlan.id}
                        data={lessonPlan}
                        onClick={setSelectedLessonPlan}
                        isActive={lessonPlan === selectedLessonPlan}
                      />
                    ))}
                  </List>
                </Stack>
              ) : (
                <NoData />
              )}
            </Stack>
          </BoxContent>
        </Grid>
        <Grid item xs={9}>
          <BoxContent>
            {selectedLessonPlan ? (
              <ModuleTeacher lessonPlanId={selectedLessonPlan.id} />
            ) : (
              <NoData title='No selected lesson plan' />
            )}
          </BoxContent>
        </Grid>
      </Grid>
      <AddPlan isOpen={isOpenCreate} onClose={closeCreate} />
    </Box>
  )
}
