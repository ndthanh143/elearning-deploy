import { icons } from '@/assets/icons'
import { CircularProgressWithLabel, CustomMenu, CustomTooltip, Flex } from '@/components'
import { useMenu } from '@/hooks'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

interface IProgressCourseProps {
  totalFinish: number
  totalLesson: number
}

export const ProgressCourse = ({ totalFinish, totalLesson }: IProgressCourseProps) => {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()
  const handleGetCertificate = () => {
    navigate(`/courses/${courseId}/certificate`)
  }

  const isFinish = totalFinish > 0 && totalLesson > 0 && totalFinish === totalLesson
  const progress = totalLesson > 0 ? totalFinish / totalLesson : 0 * 100

  return (
    <Box display='flex' alignItems='center' gap={3}>
      <CustomTooltip title={isFinish ? 'Bạn đã hoàn thành khoá học' : 'Bạn đã hoàn thành 7/15'}>
        <Flex gap={1} sx={{ cursor: 'pointer' }} onClick={progress > 50 ? handleGetCertificate : onOpen}>
          <CircularProgressWithLabel variant='determinate' value={progress}>
            <Box width={18} height={18}>
              {icons['cert']}
            </Box>
          </CircularProgressWithLabel>
          <Typography variant='body2' color='#fff' fontWeight={500}>
            {progress > 50 ? 'Get certificates' : 'Your progress'}
          </Typography>
        </Flex>
      </CustomTooltip>

      <CustomMenu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack p={2} gap={1}>
          <Typography variant='body2' fontWeight={500}>
            You have done {totalFinish}/{totalLesson}.
          </Typography>
          <Typography variant='body2'>Finish your course to get certificate</Typography>
        </Stack>
      </CustomMenu>
    </Box>
  )
}
