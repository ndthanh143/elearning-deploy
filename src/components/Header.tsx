import {
  ArrowDropDown,
  LogoutOutlined,
  MessageOutlined,
  NotificationsOutlined,
  PersonOutline,
  TableChart,
} from '@mui/icons-material'
import { Avatar, Badge, Box, Divider, Grid, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'

import { images } from '../assets/images'
import { LanguageSwitcher } from '.'
import { useAuth, useMenu } from '../hooks'

export const Header = () => {
  const { profile, logout } = useAuth()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const handleClickMenuItem = () => {
    onClose()
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container>
        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={8} display='flex' justifyContent='end' alignItems='center' gap={4}>
          <LanguageSwitcher />
          <Tooltip title='Toggle notification panel'>
            <IconButton>
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
            onClick={onOpen}
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
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
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
    </Box>
  )
}
