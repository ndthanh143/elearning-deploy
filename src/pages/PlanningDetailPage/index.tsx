import { Layout, MindMap } from '@/components'
import { useParams } from 'react-router-dom'
import { BasicPlanTeacher } from '../PlanningPage/components'

export function PlanningDetailPage() {
  const { lessonPlanId } = useParams()
  const type = 'mindmap'

  return lessonPlanId ? (
    type === 'mindmap' ? (
      <MindMap lessonPlanId={Number(lessonPlanId)} />
    ) : (
      <Layout>
        <BasicPlanTeacher lessonPlanId={Number(lessonPlanId)} />
      </Layout>
    )
  ) : null
}
