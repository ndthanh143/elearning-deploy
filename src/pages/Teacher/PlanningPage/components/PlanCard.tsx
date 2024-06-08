import { ConfirmPopup, Flex } from '@/components'
import { gray } from '@/styles/theme'
import { formatDate } from '@/utils'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import thumbnailBasic from '@/assets/images/planingPage/thumbnail-basic.webp'
import { LessonPlan } from '@/services/lessonPlan/lessonPlan.dto'
import { useNavigate } from 'react-router-dom'
import { AutoFixNormal, DeleteOutline, MoreHorizOutlined } from '@mui/icons-material'
import { useAlert, useBoolean, useMenu } from '@/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonPlanService } from '@/services/lessonPlan/lessonPlan.service'
import { lessonPlanKey } from '@/services/lessonPlan/lessonPlan.query'
import { PlanLabel } from '.'

interface IPlanCardProps {
  data: LessonPlan
  viewOnly?: boolean
}

export const thumbnailProps = {
  basic: {
    src: thumbnailBasic,
    alt: 'basic',
  },
  mindmap: {
    src: 'https://images.wondershare.com/edrawmind/articles2023/how-to-make-a-mind-map/mind-map.png',
    alt: 'mindmap',
  },
}

export function PlanCard({ data, viewOnly }: IPlanCardProps) {
  const queryClient = useQueryClient()
  const { triggerAlert } = useAlert()

  const navigate = useNavigate()
  const { anchorEl: anchorElMenu, isOpen: isOpenMoreMenu, onClose: closeMoreMenu, onOpen: openMoreMenu } = useMenu()
  const { value: isOpenConfirmPopup, setFalse: closeConfirmPopup, setTrue: openConfirmPopup } = useBoolean(false)

  const { mutate: mutateDelete, isPending: isLoadingDelete } = useMutation({
    mutationFn: lessonPlanService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonPlanKey.lists() })
      closeConfirmPopup()
      triggerAlert('Delete lesson plan successfully')
    },
    onError: () => {
      triggerAlert('Delete lesson plan failed', 'error')
    },
  })

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        image={thumbnailProps[(data.type as 'basic' | 'mindmap') || 'basic'].src}
        sx={{ height: 150, cursor: 'pointer' }}
        onClick={() => !viewOnly && navigate(`/planning/${data.id}`)}
      />
      <CardContent sx={{ flex: 1 }}>
        <Stack justifyContent='space-between' height='100%'>
          <Box flex={1}>
            <Typography variant='body1' fontWeight='bold'>
              {data.name}
            </Typography>
            <Typography variant='body2' color={gray[300]}>
              {formatDate.toRelative(new Date())}
            </Typography>
          </Box>
          <Flex justifyContent='space-between'>
            {data.type && <PlanLabel type={data.type} sx={{ mt: 1 }} />}
            {!viewOnly && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  openMoreMenu(e)
                }}
                color={isOpenMoreMenu ? 'primary' : 'default'}
              >
                <MoreHorizOutlined fontSize='small' />
              </IconButton>
            )}
          </Flex>
        </Stack>
      </CardContent>
      <Menu open={isOpenMoreMenu} onClose={closeMoreMenu} anchorEl={anchorElMenu}>
        <MenuItem onClick={() => navigate(`/planning/${data.id}`)}>
          <ListItemIcon>
            <AutoFixNormal fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Open</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            openConfirmPopup()
            closeMoreMenu()
          }}
        >
          <ListItemIcon>
            <DeleteOutline fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>Move to trash</Typography>
        </MenuItem>
      </Menu>

      <ConfirmPopup
        isOpen={isOpenConfirmPopup}
        onClose={closeConfirmPopup}
        onAccept={() => mutateDelete(data.id)}
        title='Confirm Delete'
        isLoading={isLoadingDelete}
        subtitle='Are you sure to delete this plan, this action can not be revert.'
        type='delete'
      />
    </Card>
  )
}
