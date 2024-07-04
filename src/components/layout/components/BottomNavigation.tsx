import { Button, Flex } from '@/components'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { gray } from '@/styles/theme'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

export function BottomNavigation({ lessonPlan }: { lessonPlan: LessonPlan }) {
  const navigate = useNavigate()
  const { unitId, courseId } = useParams()
  const nextUnit = lessonPlan.units.find((unit) =>
    unit.prerequisites.filter(
      (pre) => pre.parent?.id === Number(unitId),
      // (!!pre.quizInfo || !!pre.assignmentInfo || !!pre.lectureInfo || !!pre.resourceInfo),
    ),
  )

  const handleNextLesson = () => {
    if (nextUnit) {
      let affix = ''

      console.log('nextUnit', nextUnit)
      if (nextUnit.assignmentInfo) {
        affix = `/assign/${nextUnit.assignmentInfo.id}`
      }
      if (nextUnit.quizInfo) {
        affix = `/quiz/${nextUnit.quizInfo.id}`
      }
      if (nextUnit.resourceInfo) {
        affix = `/resource/${nextUnit.resourceInfo.id}`
      }
      if (nextUnit.lectureInfo) {
        affix = `/lecture/${nextUnit.lectureInfo.id}`
      }

      navigate(`/courses/${courseId}/u/${nextUnit.id}${affix}`)
    }
  }

  return (
    <Flex position='fixed' bottom={0} left={0} right={0} bgcolor={gray[100]} justifyContent='center' boxShadow={1}>
      <Flex justifyContent='center' position='relative' width='100%'>
        <Flex gap={2} py={1}>
          <Button variant='outlined' color='primary' startIcon={<ArrowBack />}>
            Previos lesson
          </Button>
          <Button variant='contained' color='primary' endIcon={<ArrowForward />}>
            Next lesson
          </Button>
          <Flex gap={1} position='absolute' right={10} onClick={handleNextLesson} sx={{ cursor: 'pointer' }}>
            <Typography fontWeight={600} variant='body2'>
              {nextUnit?.name}
            </Typography>
            <ArrowForward sx={{ color: '#000' }} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
