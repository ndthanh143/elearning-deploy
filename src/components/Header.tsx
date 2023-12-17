import { ArrowDropDown, LogoutOutlined, NotificationsOutlined, PersonOutline } from '@mui/icons-material'
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'

import { images } from '../assets/images'
import { CustomMenu } from '.'
import { useAuth, useMenu } from '../hooks'
import { Link, useNavigate } from 'react-router-dom'
import { gray } from '@/styles/theme'
import { notificationKey } from '@/services/notification/notification.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notification/notification.service'
import { useEffect } from 'react'

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
              <Typography color={gray[800]}>{parseData.topicContent}</Typography>
            </Stack>
          </Stack>
        </Box>
        <Divider />
      </>
    )
  }
}

export const Header = () => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { profile, logout } = useAuth()

  const { anchorEl: anchorElProfile, isOpen: isOpenProfile, onClose: closeProfile, onOpen: openProfile } = useMenu()
  const { anchorEl: anchorElNoti, isOpen: isOpenNoti, onClose: closeNoti, onOpen: openNoti } = useMenu()

  const notiInstance = notificationKey.list({ userId: Number(profile?.data.id) })
  const { data: notifications } = useQuery({
    ...notiInstance,
    enabled: Boolean(profile?.data.id),
  })

  const handleClickMenuItem = (href: string) => {
    closeProfile()
    navigate(href)
  }

  const { mutate: mutateReadNoti } = useMutation({ mutationFn: notificationService.read })

  useEffect(() => {
    if (isOpenNoti && notifications) {
      const updateNotiList = notifications.map((noti) => ({ ...noti, isRead: true }))
      queryClient.setQueryData(notiInstance.queryKey, updateNotiList)
      mutateReadNoti()
    }
  }, [isOpenNoti])

  const countUnreadNoti = notifications?.reduce((acc, cur) => {
    return !cur.isRead ? acc + 1 : acc
  }, 0)

  return (
    <Box sx={{ p: 2 }}>
      <Grid container>
        <Grid item xs={4}>
          <Stack direction='row' gap={2} alignItems='center' onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            <Box
              component='img'
              src={images.logo}
              alt='logo'
              width={60}
              height={60}
              style={{
                objectFit: 'cover',
              }}
            />
            <Typography variant='h5' fontWeight={700}>
              BrainStone
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={8} display='flex' justifyContent='end' alignItems='center' gap={4}>
          {/* <LanguageSwitcher /> */}
          <Tooltip title='Toggle notification panel'>
            <IconButton onClick={openNoti}>
              <Badge badgeContent={countUnreadNoti} color='primary'>
                <NotificationsOutlined color='secondary' />
              </Badge>
            </IconButton>
          </Tooltip>
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

      <CustomMenu
        anchorEl={anchorElNoti}
        open={isOpenNoti}
        onClose={closeNoti}
        elevation={5}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ maxHeight: '50vh', overflow: 'scroll' }}>
          {notifications && notifications.map((noti) => parseMessage('topic', noti.message))}
        </Box>
      </CustomMenu>
    </Box>
  )
}
