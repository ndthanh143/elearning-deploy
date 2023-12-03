import { BoxContent } from '@/components'
import { useMenu } from '@/hooks'
import { assignmentKeys } from '@/services/assignment/assignment.query'
import { formatDate } from '@/utils'
import { MoreVert, PeopleAltOutlined } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

export type AssignmentContentProps = {
  assignmentId?: string
}

export const AssignmentContent = ({ assignmentId }: AssignmentContentProps) => {
  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const genMenuMoreHeading = () => (
    <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
      <MenuItem>Sao chép đường liên kết</MenuItem>
    </Menu>
  )

  const assignmentInstance = assignmentKeys.detail(Number(assignmentId))
  const { data: assignment } = useQuery({ ...assignmentInstance, enabled: Boolean(assignmentId) })

  if (!assignment) {
    return null
  }

  return (
    <>
      <BoxContent>
        <Stack direction='row' justifyContent='space-between' gap={2}>
          <Typography variant='h5'>{assignment.assignmentTitle}</Typography>
          <IconButton onClick={onOpen}>
            <MoreVert color='primary' />
          </IconButton>
        </Stack>
        <Box display='flex' gap={1}>
          <Typography>Opened:</Typography>
          <Typography fontWeight={500}>{formatDate.toDateTime(new Date(assignment.startDate))}</Typography>
        </Box>
        <Box display='flex' gap={1}>
          <Typography>Due:</Typography>
          <Typography fontWeight={500}>
            {assignment.endDate ? formatDate.toDateTime(new Date(assignment.endDate)) : 'Unlimited'}
          </Typography>
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <Typography lineHeight={2}>{assignment.assignmentContent}</Typography>
        <Divider sx={{ marginY: 2 }} />
        <Stack direction='row' gap={1} alignItems='center'>
          <PeopleAltOutlined />
          <Typography>Bình luận</Typography>
        </Stack>
        <Button>Thêm bình luận</Button>
      </BoxContent>
      {genMenuMoreHeading()}
    </>
  )
}
