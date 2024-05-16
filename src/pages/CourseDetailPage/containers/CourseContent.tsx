import { Course } from '@/services/course/course.dto'
import { Box } from '@mui/material'
import { MindMapStudent } from '@/components/MindMap/MindMapStudent'
import { BasicPlanStudent } from '.'

export type CourseContentProps = {
  data: Course
}
export const CourseContent = ({ data }: CourseContentProps) => {
  return (
    data.lessonPlanInfo && (
      <Box>
        {data.lessonPlanInfo.type === 'basic' ? (
          <MindMapStudent lessonPlan={data.lessonPlanInfo} />
        ) : (
          <BasicPlanStudent lessonPlan={data.lessonPlanInfo} />
        )}
      </Box>
    )
  )
}
