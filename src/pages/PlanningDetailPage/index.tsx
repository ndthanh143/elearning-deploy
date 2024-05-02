import { Layout, MindMap } from '@/components'
import { useParams } from 'react-router-dom'
import { BasicPlanTeacher } from '../PlanningPage/components'
import { useQuery } from '@tanstack/react-query'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'

export function PlanningDetailPage() {
  const { lessonPlanId } = useParams()
  const type = 'mindmap'

  const lessonPlanInstance = lessonPlanKey.detail(Number(lessonPlanId))
  const { data: lessonPlan } = useQuery({ ...lessonPlanInstance, enabled: !!lessonPlanId })

  return lessonPlan ? (
    lessonPlan.type === 'basic' ? (
      <MindMap lessonPlanId={Number(lessonPlanId)} />
    ) : (
      <Layout>
        <BasicPlanTeacher lessonPlanId={Number(lessonPlanId)} />
      </Layout>
    )
  ) : null
}
