import {
  ArrowDropDown,
  LogoutOutlined,
  MessageOutlined,
  NotificationsOutlined,
  PersonOutline,
  TableChart,
} from '@mui/icons-material'
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
import { useNavigate } from 'react-router-dom'
import { gray } from '@/styles/theme'

export const Header = () => {
  const navigate = useNavigate()

  const { profile, logout } = useAuth()

  const { anchorEl: anchorElProfile, isOpen: isOpenProfile, onClose: closeProfile, onOpen: openProfile } = useMenu()
  const { anchorEl: anchorElNoti, isOpen: isOpenNoti, onClose: closeNoti, onOpen: openNoti } = useMenu()

  const handleClickMenuItem = (href: string) => {
    closeProfile()
    navigate(href)
  }

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
              Sunstone
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={8} display='flex' justifyContent='end' alignItems='center' gap={4}>
          {/* <LanguageSwitcher /> */}
          <Tooltip title='Toggle notification panel'>
            <IconButton onClick={openNoti}>
              <Badge badgeContent={2} color='primary'>
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
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }} onClick={() => handleClickMenuItem('')}>
          <TableChart />
          <Typography>Scores</Typography>
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }} onClick={() => handleClickMenuItem('')}>
          <MessageOutlined />
          <Typography>Message</Typography>
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
          <Box maxWidth={300} p={2}>
            <Stack direction='row' gap={2}>
              <Stack>
                <Typography fontWeight={500}>
                  MUI X v6.18.x and the latest improvements before the next major
                </Typography>
                <Typography color={gray[800]}>
                  New stable components, polished features, better performance and more. Check out the details in our
                  recent blog post.
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Divider />
          <Box maxWidth={300} p={2}>
            <Stack direction='row' gap={2}>
              <Stack>
                <Typography fontWeight={500}>
                  MUI X v6.18.x and the latest improvements before the next major
                </Typography>
                <Typography color={gray[800]}>
                  New stable components, polished features, better performance and more. Check out the details in our
                  recent blog post.
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Divider />
          <Box maxWidth={300} p={2}>
            <Stack direction='row' gap={2}>
              <Stack>
                <Typography fontWeight={500}>
                  MUI X v6.18.x and the latest improvements before the next major
                </Typography>
                <Typography color={gray[800]}>
                  New stable components, polished features, better performance and more. Check out the details in our
                  recent blog post.
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Divider />
        </Box>
      </CustomMenu>
    </Box>
  )
}
