import { Flex, Layout, Loading, MindMap } from '@/components'
import { useParams } from 'react-router-dom'
import { BasicPlanTeacher } from '../PlanningPage/components'
import { useQuery } from '@tanstack/react-query'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'

export function PlanningDetailPage() {
  const { lessonPlanId } = useParams()

  const lessonPlanInstance = lessonPlanKey.detail(Number(lessonPlanId))
  const { data: lessonPlan, isLoading } = useQuery({ ...lessonPlanInstance, enabled: !!lessonPlanId })

  if (isLoading) {
    return (
      <Flex height='100vh' alignItems='center'>
        <Loading />
      </Flex>
    )
  }

  return lessonPlan ? (
    lessonPlan.type === 'mindmap' ? (
      <MindMap lessonPlanId={Number(lessonPlanId)} />
    ) : (
      <Layout>
        <BasicPlanTeacher lessonPlanId={Number(lessonPlanId)} />
      </Layout>
    )
  ) : null
}
