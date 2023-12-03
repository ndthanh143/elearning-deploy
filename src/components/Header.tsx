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
import { CustomMenu, LanguageSwitcher } from '.'
import { useAuth, useMenu } from '../hooks'
import { useNavigate } from 'react-router-dom'

export const Header = () => {
  const navigate = useNavigate()

  const { profile, logout } = useAuth()

  const { anchorEl: anchorElProfile, isOpen: isOpenProfile, onClose: closeProfile, onOpen: openProfile } = useMenu()
  const { anchorEl: anchorElNoti, isOpen: isOpenNoti, onClose: closeNoti, onOpen: openNoti } = useMenu()

  const handleClickMenuItem = () => {
    closeProfile()
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
          <LanguageSwitcher />
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
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }} onClick={handleClickMenuItem}>
          <PersonOutline />
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }} onClick={handleClickMenuItem}>
          <TableChart />
          <Typography>Scores</Typography>
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }} onClick={handleClickMenuItem}>
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
        <Typography variant='body2' mb={1} ml={2} textAlign='left'>
          Your notifications
        </Typography>
        <Divider />
        <MenuItem sx={{ my: 1 }}>
          <Stack direction='row' gap={2}>
            <Avatar src='https://cdn.tuoitre.vn/thumb_w/640/471584752817336320/2023/2/10/2736796065095908771941249179080146527866732n-16760123424561767223067.jpg' />
            <Stack>
              <Typography fontWeight={500}>Cristiano Ronaldo</Typography>
              <Typography>Cristiano has create new Topic in your course</Typography>
            </Stack>
          </Stack>
        </MenuItem>
        <MenuItem sx={{ my: 1 }}>
          <Stack direction='row' gap={2}>
            <Avatar src='https://cdn.tuoitre.vn/thumb_w/640/471584752817336320/2023/2/10/2736796065095908771941249179080146527866732n-16760123424561767223067.jpg' />
            <Stack>
              <Typography fontWeight={500}>Cristiano Ronaldo</Typography>
              <Typography>Cristiano has create new Topic in your course</Typography>
            </Stack>
          </Stack>
        </MenuItem>
        <MenuItem sx={{ my: 1 }}>
          <Stack direction='row' gap={2}>
            <Avatar src='https://cdn.tuoitre.vn/thumb_w/640/471584752817336320/2023/2/10/2736796065095908771941249179080146527866732n-16760123424561767223067.jpg' />
            <Stack>
              <Typography fontWeight={500}>Cristiano Ronaldo</Typography>
              <Typography>Cristiano has create new Topic in your course</Typography>
            </Stack>
          </Stack>
        </MenuItem>
      </CustomMenu>
    </Box>
  )
}
