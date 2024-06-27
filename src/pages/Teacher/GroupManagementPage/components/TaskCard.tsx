import { CustomMenu, Flex } from '@/components'
import { primary } from '@/styles/theme'
import { DeleteRounded, EditRounded, MoreVertRounded } from '@mui/icons-material'
import { Box, IconButton, ListItemIcon, MenuItem, Stack, Typography } from '@mui/material'
import { useDrag, useDrop, DragSourceMonitor } from 'react-dnd'
import { icons } from '@/assets/icons'
import { GroupTaskInfo } from '@/services/group/dto'
import { formatDate } from '@/utils'
import { useBoolean, useMenu } from '@/hooks'
import { green } from '@mui/material/colors'
import { ModalGroupTaskDetail } from '.'

interface TaskCardProps {
  index: number
  data: GroupTaskInfo
  moveTask: (fromIndex: number, toIndex: number) => void
  onUpdate?: () => void
  onDelete?: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
  data,
  index,
  moveTask,
  onUpdate = () => {},
  onDelete = () => {},
}) => {
  const { anchorEl, onClose, onOpen, isOpen } = useMenu()
  const { value: isOpenGroupTaskDetail, setTrue: openGroupTaskDetail, setFalse: closeGroupTaskDetail } = useBoolean()
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  return (
    <>
      <Stack
        ref={(node) => drag(drop(node))}
        gap={1}
        p={2}
        borderRadius={3}
        bgcolor={data.isSubmitted ? green[100] : primary[50]}
        sx={{ opacity: isDragging ? 0.5 : 1, height: '100%', cursor: 'pointer' }}
        onClick={openGroupTaskDetail}
      >
        <Flex justifyContent='space-between'>
          <Typography variant='body2' fontWeight={700}>
            {data.taskName}
          </Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              onOpen(e)
            }}
          >
            <MoreVertRounded fontSize='small' />
          </IconButton>
        </Flex>
        <Box display='flex'>
          <Typography variant='body2'>{data.description}</Typography>
        </Box>
        <Flex justifyContent='end' mt={2}>
          <Stack gap={1}>
            <Flex gap={1}>
              {icons['calendar']}
              <Typography variant='body2' fontWeight={600}>
                {formatDate.toDateTime(new Date(data.startDate))}
              </Typography>
            </Flex>
            <Flex gap={1}>
              {icons['deadline']}
              <Typography variant='body2' fontWeight={600}>
                {formatDate.toDateTime(new Date(data.endDate))}
              </Typography>
            </Flex>
          </Stack>
        </Flex>
      </Stack>
      <CustomMenu anchorEl={anchorEl} onClose={onClose} open={isOpen}>
        <MenuItem
          onClick={() => {
            onClose()
            onUpdate()
          }}
        >
          <ListItemIcon>
            <EditRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Edit</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClose()
            onDelete()
          }}
        >
          <ListItemIcon>
            <DeleteRounded fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Remove</Typography>
        </MenuItem>
      </CustomMenu>
      <ModalGroupTaskDetail data={data} isOpen={isOpenGroupTaskDetail} onClose={closeGroupTaskDetail} />
    </>
  )
}
