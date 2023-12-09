import actions from '@/assets/images/icons/actions'
import { useMenu } from '@/hooks'
import { AssignmentsInfo } from '@/services/user/user.dto'
import { gray } from '@/styles/theme'
import { formatDate } from '@/utils'
import { MoreHorizOutlined } from '@mui/icons-material'
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

export type AssignmentItemProps = {
  isActive?: boolean
  onClick?: () => void
  assignmentData: AssignmentsInfo
}

export const AssignmentItem = ({ isActive, onClick, assignmentData }: AssignmentItemProps) => {
  const navigate = useNavigate()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const handleViewInfo = () => {
    navigate(`/courses/${assignmentData.courseInfo.id}/assign/${assignmentData.assignmentInfo.id}`)
  }

  return (
    assignmentData && (
      <>
        <Stack
          gap={1}
          bgcolor={isActive ? blue[50] : 'transparent'}
          padding={isActive ? 2 : 0}
          borderRadius={3}
          sx={{
            transition: 'all ease 0.2s',
            cursor: 'pointer',
          }}
          onClick={onClick}
        >
          <Stack direction='row' mb={1} alignItems='center' justifyContent='space-between'>
            <Stack direction='row' gap={2} alignItems='center'>
              <Box component='img' src={actions.assignment} width={30} height={30} />
              <Typography fontWeight={500}>{assignmentData.assignmentInfo.assignmentTitle}</Typography>
            </Stack>
            <IconButton onClick={onOpen}>
              <MoreHorizOutlined />
            </IconButton>
          </Stack>

          <Typography color={gray[800]} fontStyle='italic'>
            {assignmentData.courseInfo.courseName}
          </Typography>
          <Typography>Open: {formatDate.toDateTime(assignmentData.assignmentInfo.startDate)}</Typography>
          <Typography>
            Close:{' '}
            {assignmentData.assignmentInfo.endDate
              ? formatDate.toDateTime(assignmentData.assignmentInfo.endDate)
              : 'Unlimited'}
          </Typography>
        </Stack>
        <Menu
          open={isOpen}
          anchorEl={anchorEl}
          onClose={onClose}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
          <MenuItem onClick={handleViewInfo}>View info</MenuItem>
        </Menu>
      </>
    )
  )
}
