import {
  DeleteRounded,
  DraftsRounded,
  FilterListOutlined,
  KeyboardDoubleArrowLeftOutlined,
  LogoutOutlined,
  MoreHorizOutlined,
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

import { CustomMenu, DangerouseLyRender, Flex, IconContainer } from '.'
import { useAuth, useBoolean, useMenu, useOnClickOutside } from '../hooks'
import { Link, useNavigate } from 'react-router-dom'
import { notificationKey } from '@/services/notification/notification.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notification/notification.service'
import { useRef } from 'react'
import { blue, gray, primary } from '@/styles/theme'
import { images } from '@/assets/images'
import { motion } from 'framer-motion'
import { Account } from '@/services/user/user.dto'
import { icons } from '@/assets/icons'

const Message = ({
  type,
  data,
  refId,
  author,
}: {
  type: 'TOPIC' | 'COMMENT'
  data: string
  refId: number
  author?: Account
}) => {
  const navigate = useNavigate()
  const parseData = JSON.parse(data)

  const navigateObj = {
    TOPIC: `/courses/${parseData.forumId}#${refId}`,
    COMMENT: `/courses/${parseData.forumId}`,
  }

  const renderContent = {
    TOPIC: {
      label: (
        <>
          created a topic in course{' '}
          {/* <Box
            component={Link}
            to={`/courses/${parseData.forumId}`}
            sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}
          >
            {parseData.forumTitle}
          </Box> */}
        </>
      ),
      content: parseData.topicContent,
    },
    COMMENT: {
      label: (
        <>
          commented in{' '}
          <Box
            component={Link}
            to={`/courses/${parseData.forumId}`}
            sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}
          >
            {parseData.forumTitle}
          </Box>
        </>
      ),
      content: parseData.content,
    },
  }

  const handleNavigate = () => {
    navigate(navigateObj[type])
  }

  return (
    <>
      <Box
        width='100%'
        p={2}
        sx={{
          ':hover': {
            bgcolor: primary[50],
          },
          cursor: 'pointer',
        }}
        onClick={handleNavigate}
      >
        <Flex mb={1} gap={1} flexWrap='wrap'>
          <Avatar
            src={author?.avatarPath}
            alt={author?.fullName}
            sx={{
              bgcolor: 'primary.main',
              width: 30,
              height: 30,
            }}
          >
            {author?.fullName.charAt(0)}
          </Avatar>
          <Typography variant='body2' fontWeight={700}>
            {author?.fullName}
          </Typography>
          <Typography variant='body2'>{renderContent[type].label}</Typography>
        </Flex>
        <Box ml={4}>
          {type === 'TOPIC' ? (
            <Box border={1} borderRadius={3} p={1} borderColor='primary.main' bgcolor='primary.main'>
              <Typography variant='body2' fontWeight={700} color='primary.contrastText'>
                {parseData.forumTitle}
              </Typography>
            </Box>
          ) : (
            <DangerouseLyRender content={renderContent[type].content} maxHeight={120} overflow='hidden' />
          )}
        </Box>
      </Box>
      <Divider sx={{ bgcolor: primary[100] }} />
    </>
  )
}

const Notification = () => {
  const queryClient = useQueryClient()

  const { profile } = useAuth()

  const { value: isOpenNoti, setFalse: closeNoti, toggle: toggleNoti } = useBoolean(false)

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

  const { mutate: mutateReadNoti } = useMutation({
    mutationFn: notificationService.read,
    onSuccess: () => {
      closeMoreActions()
    },
  })

  const countUnreadNoti = notifications?.reduce((acc, cur) => {
    return !cur.isRead ? acc + 1 : acc
  }, 0)

  useOnClickOutside(notiRef, closeNoti)

  const handleReadAllNoti = () => {
    const updateNotiList = notifications?.map((noti) => ({ ...noti, isRead: true }))
    queryClient.setQueryData(notiInstance.queryKey, updateNotiList)
    mutateReadNoti()
  }

  const moreActionsItem = [
    {
      icon: <DraftsRounded fontSize='small' />,
      text: 'Mark all as read',
      onClick: () => {
        handleReadAllNoti()
      },
    },
    {
      icon: <DeleteRounded fontSize='small' />,
      text: 'Archive',
      onClick: () => {
        closeMoreActions()
      },
    },
  ]

  return (
    <>
      <Badge badgeContent={countUnreadNoti} color='primary'>
        <IconContainer isActive sx={{ cursor: 'pointer' }} onClick={toggleNoti}>
          {icons['notification']}
        </IconContainer>
      </Badge>
      <Box
        sx={{
          height: '100vh',
          width: isOpenNoti ? 400 : 0,
          position: 'absolute',
          overflow: 'hidden',
          zIndex: 10,
          bgcolor: 'white',
          opacity: isOpenNoti ? 1 : 0,
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
        <Stack height='90%' sx={{ overflowY: 'scroll' }}>
          <Typography px={2} variant='body2' color={gray[500]} fontWeight={500}>
            Oldest
          </Typography>
          {notifications &&
            notifications.map(
              (noti) =>
                (noti.studentInfo || noti.teacherInfo) && (
                  <Box
                    key={noti.id}
                    sx={{ borderBottom: '1px solid #ededed' }}
                    component={motion.div}
                    {...(!noti.isRead && {
                      initial: { backgroundColor: 'transparent' },
                      animate: !isOpenNoti ? { backgroundColor: primary[400] } : { backgroundColor: primary[100] },
                    })}
                    transition={{ duration: 0.5 }}
                  >
                    <Message
                      type={noti.kind}
                      data={noti.message}
                      refId={noti.refId}
                      author={noti.studentInfo || noti.teacherInfo}
                    />
                  </Box>
                ),
            )}
        </Stack>
        <Menu anchorEl={anchorElMoreActions} open={isOpenMoreActions} onClose={closeMoreActions}>
          {moreActionsItem.map((item) => (
            <MenuItem
              key={item.text}
              onClick={(e) => {
                e.stopPropagation()
                item.onClick()
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Typography variant='body2'>{item.text}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  )
}

export const Header = () => {
  const navigate = useNavigate()

  const { profile, logout } = useAuth()

  const { anchorEl: anchorElProfile, isOpen: isOpenProfile, onClose: closeProfile, onOpen: openProfile } = useMenu()

  const handleClickMenuItem = (href: string) => {
    closeProfile()
    navigate(href)
  }

  return (
    <>
      <Box sx={{ px: 4, boxShadow: '0 1px 2px 0 rgba(0,0,0,.05)' }} position='relative' bgcolor={'#FEF8FF'}>
        <Grid container>
          <Grid item xs={6}>
            <Flex alignItems='center' height='100%' gap={10}>
              <Box
                component='img'
                src={images.logo}
                alt='logo'
                width={30}
                height={30}
                style={{
                  objectFit: 'cover',
                }}
              />
              <Typography variant='body1' fontWeight={700}>
                Hi, {profile?.data.fullName}
              </Typography>
            </Flex>
          </Grid>
          <Grid item xs={6} display='flex' justifyContent='end' alignItems='center' gap={4}>
            {/* <LanguageSwitcher /> */}
            <Notification />
            <Box display='flex' alignItems='center' gap={2} sx={{ py: 1, cursor: 'pointer' }} onClick={openProfile}>
              <Box
                border={3}
                borderColor={blue[500]}
                borderRadius='100%'
                sx={{
                  ':hover': {
                    borderColor: blue[300],
                    transition: 'all 0.1s ease-in-out',
                  },
                  cursor: 'pointer',
                }}
              >
                <Avatar
                  src={profile?.data.avatarPath}
                  alt={profile?.data.fullName}
                  sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}
                >
                  N
                </Avatar>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <CustomMenu
          anchorEl={anchorElProfile}
          open={isOpenProfile}
          onClose={closeProfile}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Stack px={2} mb={2}>
            <Typography fontWeight={700}>{profile?.data.fullName}</Typography>
            <Typography fontWeight={600} variant='body2' color={gray[400]}>
              {profile?.data.email}
            </Typography>
          </Stack>
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }}
            onClick={() => handleClickMenuItem('/profile')}
          >
            <PersonOutline color='primary' fontSize='small' />
            <Typography variant='body2' fontWeight={500}>
              Profile
            </Typography>
          </MenuItem>

          <Divider />
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }} onClick={logout}>
            <LogoutOutlined color='primary' fontSize='small' />
            <Typography variant='body2' fontWeight={500}>
              Logout
            </Typography>
          </MenuItem>
        </CustomMenu>
      </Box>
    </>
  )
}
