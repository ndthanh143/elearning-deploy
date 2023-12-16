import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { Box, ListItemButton, ListItemText } from '@mui/material'
import { blue } from '@mui/material/colors'

export type LessonPlanCardProps = {
  data: LessonPlan
  isActive: boolean
  onClick: (data: LessonPlan) => void
}
export const LessonPlanCard = ({ data, isActive, onClick }: LessonPlanCardProps) => {
  const handleClick = () => onClick(data)

  return (
    <Box
      borderRadius={3}
      overflow='hidden'
      sx={{
        ':hover': {
          bgcolor: blue[50],
        },
        ...(isActive && { bgcolor: blue[50] }),
      }}
      onClick={handleClick}
    >
      <ListItemButton>
        <ListItemText>{data.name}</ListItemText>
      </ListItemButton>
    </Box>
  )
}
