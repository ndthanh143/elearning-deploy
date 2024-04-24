import {
  ArrowDropDown,
  DeleteOutline,
  DraftsOutlined,
  FilterListOutlined,
  KeyboardDoubleArrowLeftOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoreHorizOutlined,
  NotificationsOutlined,
  PersonOutline,
} from '@mui/icons-material'
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'

import { DangerouseLyRender, Flex } from '.'
import { useAuth, useBoolean, useMenu, useOnClickOutside } from '../hooks'
import { Link, useNavigate } from 'react-router-dom'
import { notificationKey } from '@/services/notification/notification.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notification/notification.service'
import { useEffect, useRef } from 'react'

const parseMessage = (type: string, data: string) => {
  const parseData = JSON.parse(data)
  if (type === 'topic') {
    return (
      <>
        <Box maxWidth={300} p={2}>
          <Stack direction='row' gap={2}>
            <Stack>
              <Typography>
                New topic in forum{' '}
                <Box
                  component={Link}
                  to={`/forum?id=${parseData.forumId}`}
                  sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}
                >
                  {parseData.forumTitle}
                </Box>
              </Typography>
              <DangerouseLyRender content={parseData.topicContent} maxHeight={120} overflow='hidden' />
            </Stack>
          </Stack>
        </Box>
        <Divider />
      </>
    )
  }
}

const Notification = () => {
  const queryClient = useQueryClient()

  const { profile } = useAuth()

  const { value: isOpenNoti, setFalse: closeNoti, setTrue: openNoti } = useBoolean(false)

  const {
    anchorEl: anchorElMoreActions,
    isOpen: isOpenMoreActions,
    onClose: closeMoreActions,
    onOpen: openMoreActions,
  } = useMenu()

  const notiRef = useRef(null)

  const notiInstance = notificationKey.list({ userId: Number(profile?.data.id) })
  const { data: notifications } = useQuery({
    ...notiInstance,
    enabled: Boolean(profile?.data.id),
  })

  const { mutate: mutateReadNoti } = useMutation({ mutationFn: notificationService.read })

  const countUnreadNoti = notifications?.reduce((acc, cur) => {
    return !cur.isRead ? acc + 1 : acc
  }, 0)

  useOnClickOutside(notiRef, closeNoti)

  const moreActionsItem = [
    {
      icon: <DraftsOutlined fontSize='small' />,
      text: 'Mark all as read',
      onClick: () => {
        closeMoreActions()
      },
    },
    {
      icon: <DeleteOutline fontSize='small' />,
      text: 'Archive',
      onClick: () => {
        closeMoreActions()
      },
    },
  ]

  useEffect(() => {
    if (isOpenNoti && notifications) {
      const updateNotiList = notifications.map((noti) => ({ ...noti, isRead: true }))
      queryClient.setQueryData(notiInstance.queryKey, updateNotiList)
      mutateReadNoti()
    }
  }, [isOpenNoti])

  return (
    <>
      <Tooltip title='Toggle notification panel'>
        <IconButton onClick={openNoti}>
          <Badge badgeContent={countUnreadNoti} color='primary'>
            <NotificationsOutlined color='secondary' />
          </Badge>
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          height: '100vh',
          width: isOpenNoti ? 300 : 0,
          position: 'absolute',
          overflow: 'hidden',
          zIndex: 10,
          bgcolor: 'white',
          borderColor: '#ccc',
          boxShadow: 1,
          left: 0,
          bottom: 0,
          top: 0,
          transition: 'all 0.2s ease-in-out',
        }}
        ref={notiRef}
      >
        <Flex px={2} py={2} justifyContent='space-between'>
          <Flex gap={1}>
            <Typography variant='body2' fontWeight={700}>
              Inbox
            </Typography>
            <Tooltip title='Filter inbox'>
              <IconButton size='small'>
                <FilterListOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </Flex>
          <Flex gap={1}>
            <Tooltip title='More actions'>
              <IconButton size='small' onClick={openMoreActions}>
                <MoreHorizOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Close Inbox'>
              <IconButton size='small' onClick={closeNoti}>
                <KeyboardDoubleArrowLeftOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
        {notifications &&
          notifications.map((noti) => (
            <Box key={noti.id} sx={{ borderBottom: '1px solid #ededed' }}>
              {parseMessage('topic', noti.message)}
            </Box>
          ))}
        <Menu anchorEl={anchorElMoreActions} open={isOpenMoreActions} onClose={closeMoreActions}>
          {moreActionsItem.map((item) => (
            <MenuItem key={item.text} onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Typography variant='body2'>{item.text}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  )
}

interface IHeaderProps {
  onExpand: () => void
  isCollapseSideBar: boolean
}

export const Header = ({ isCollapseSideBar, onExpand }: IHeaderProps) => {
  const navigate = useNavigate()

  const { profile, logout } = useAuth()

  const { anchorEl: anchorElProfile, isOpen: isOpenProfile, onClose: closeProfile, onOpen: openProfile } = useMenu()

  const handleClickMenuItem = (href: string) => {
    closeProfile()
    navigate(href)
  }

  return (
    <>
      <Box sx={{ px: 2 }} position='relative'>
        <Grid container>
          <Grid item xs={4}>
            <Flex alignItems='center' height='100%'>
              {isCollapseSideBar && (
                // <Tooltip title='Open sidebar'>
                <IconButton onClick={onExpand} sx={{ display: isCollapseSideBar ? 'flex' : 'none' }}>
                  <MenuOutlined fontSize='small' />
                </IconButton>
                // </Tooltip>
              )}
            </Flex>
          </Grid>
          <Grid item xs={8} display='flex' justifyContent='end' alignItems='center' gap={4}>
            {/* <LanguageSwitcher /> */}
            <Notification />
            <Box
              display='flex'
              alignItems='center'
              gap={2}
              sx={{ bgcolor: '#fff', px: 2, py: 1, borderRadius: 3 }}
              onClick={openProfile}
            >
              <Avatar src={profile?.data.avatarPath} alt={profile?.data.fullName} sx={{ bgcolor: 'primary.main' }}>
                N
              </Avatar>
              <Typography>{profile?.data.fullName}</Typography>
              <ArrowDropDown />
            </Box>
          </Grid>
        </Grid>
        <Menu
          anchorEl={anchorElProfile}
          open={isOpenProfile}
          onClose={closeProfile}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }}
            onClick={() => handleClickMenuItem('/profile')}
          >
            <PersonOutline />
            <Typography>Profile</Typography>
          </MenuItem>

          <Divider />
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }} onClick={logout}>
            <LogoutOutlined />
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
      <Divider />
    </>
  )
}
